document.addEventListener('DOMContentLoaded', function() {
	const subjects = document.querySelectorAll('.subject');
	const tooltip = document.getElementById('tooltip');
	const searchInput = document.getElementById('search');
	const printBtn = document.getElementById('print-btn');
	const noResults = document.createElement('p');

	// "No results found" message setup
	noResults.textContent = "No results found.";
	noResults.style.display = 'none';
	noResults.style.color = 'red';
	noResults.style.textAlign = 'center';
	noResults.style.fontSize = '16px';
	document.querySelector('table').appendChild(noResults);

	// Tooltip functionality
	subjects.forEach(subject => {
		subject.addEventListener('mouseenter', e => {
			const tutorName = e.target.getAttribute('data-tutor');
			tooltip.textContent = tutorName;
			tooltip.style.display = 'block';
		});

		subject.addEventListener('mouseleave', () => {
			tooltip.style.display = 'none';
		});
	});

	// Search functionality
	searchInput.addEventListener('input', function(e) {
		const filter = e.target.value.toLowerCase();
		const rows = document.querySelectorAll('table tr');
		let hasResults = false;

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
			if (match) hasResults = true;
		});

		noResults.style.display = hasResults ? 'none' : 'block';
	});

	// Print functionality
	printBtn.addEventListener('click', function() {
		const timetable = document.getElementById('timetable');
		html2canvas(timetable).then(canvas => {
			const imgData = canvas.toDataURL('image/png');
			const { jsPDF } = window.jspdf;
			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 210;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
			pdf.save('Clarity-timetable.pdf');
		});
	});
});

// Alert functionality
function showAlert() {
	const alertDiv = document.createElement('div');
	alertDiv.classList.add('alert', 'fadeIn');
	alertDiv.innerHTML = `
      <span class="close-alert">&times;</span>
      <p>If you haven't joined the class, click below:</p>
      <a href="https://wa.link/ndi9mk" target="_blank">Join the Class</a>
    `;
	document.body.appendChild(alertDiv);

	alertDiv.querySelector('.close-alert').onclick = function() {
		alertDiv.classList.add('fadeOut');
		setTimeout(() => alertDiv.remove(), 500);
	};
}

setTimeout(showAlert, 5000);
setInterval(showAlert, 60000);
