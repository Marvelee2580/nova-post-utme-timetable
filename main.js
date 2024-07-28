document.addEventListener('DOMContentLoaded', function() {
	const subjects = document.querySelectorAll('.subject');
	const tooltip = document.getElementById('tooltip');
	const notePopup = document.getElementById('note-popup');
	const noteText = document.getElementById('note-text');
	const saveNote = document.getElementById('save-note');
	const closeNotePopup = document.getElementById('close-note-popup');
	const searchInput = document.getElementById('search');
	const reminderPopup = document.getElementById('reminder-popup');
	const reminderSave = document.getElementById('reminder-save');
	const reminderClose = document.getElementById('reminder-close');
	const printBtn = document.getElementById('print-btn');

	// Show tutor name on hover
	subjects.forEach(subject => {
		subject.addEventListener('mouseenter', (e) => {
			const tutorName = e.target.getAttribute('data-tutor');
			tooltip.textContent = tutorName;
			tooltip.style.display = 'block';
			tooltip.style.left = `${e.pageX + 10}px`;
			tooltip.style.top = `${e.pageY + 10}px`;
		});

		subject.addEventListener('mouseleave', () => {
			tooltip.style.display = 'none';
		});

		// Open note popup on double-click
		subject.addEventListener('dblclick', (e) => {
			notePopup.style.display = 'block';
			noteText.value = subject.getAttribute('data-note') || '';
			saveNote.onclick = function() {
				subject.setAttribute('data-note', noteText.value);
				notePopup.style.display = 'none';
			};
		});
	});

	// Close note popup
	closeNotePopup.addEventListener('click', () => {
		notePopup.style.display = 'none';
	});

	// Highlight current class
	function highlightCurrentClass() {
		const now = new Date();
		const currentHour = now.getHours();
		const currentMinute = now.getMinutes();

		subjects.forEach(subject => {
			const timeSlot = subject.parentElement.firstElementChild.textContent;
			const [startHour, startMinute] = timeSlot.split('-')[0].split(':').map(Number);

			if (currentHour === startHour && currentMinute >= startMinute) {
				subject.style.backgroundColor = 'yellow'; // Highlight color
			} else {
				subject.style.backgroundColor = ''; // Reset color
			}
		});
	}

	setInterval(highlightCurrentClass, 60000); // Update every minute
	highlightCurrentClass();

	// Filter subjects
	searchInput.addEventListener('input', function(e) {
		const filter = e.target.value.toLowerCase();
		const rows = document.querySelectorAll('table tr');

		rows.forEach(row => {
			const cells = row.getElementsByTagName('td');
			let match = false;
			for (let cell of cells) {
				if (cell.textContent.toLowerCase().includes(filter)) {
					match = true;
					break;
				}
			}
			row.style.display = match ? '' : 'none';
		});
	});

	// Pop-up functionality for joining class
	function showAlert() {
		const alertDiv = document.createElement('div');
		alertDiv.classList.add('alert');
		alertDiv.innerHTML = `
      <span class="close-alert">&times;</span>
      <p>If you haven't joined the class, you have the opportunity to now by clicking the link below:</p>
      <a href="https://api.whatsapp.com/send?phone=+2347065251296&text=Hi+Sir!+I+want+to+register+for+the+OPERATION+POST+UTME+CLASS" target="_blank">Join the Class</a>
    `;
		document.body.appendChild(alertDiv);

		alertDiv.querySelector('.close-alert').onclick = function() {
			alertDiv.remove();
		};
	}

	setTimeout(showAlert, 5000); // Show after 5 seconds
	setInterval(showAlert, 35000); // Show every 35seconds

	// Print functionality
	printBtn.addEventListener('click', function() {
		const timetable = document.getElementById('timetable');
		html2canvas(timetable).then(canvas => {
			const imgData = canvas.toDataURL('image/png');
			const { jsPDF } = window.jspdf;
			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 210; // A4 width in mm
			const pageHeight = 297; // A4 height in mm
			const imgHeight = canvas.height * imgWidth / canvas.width;
			let heightLeft = imgHeight;
			let position = 0;

			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;

			while (heightLeft >= 0) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'PDF', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}
			pdf.save('timetable.pdf');
		});
	});
});