document.addEventListener('DOMContentLoaded', function() {
            const studentNameDisplay = document.getElementById('studentName');
            const sectionButtons = document.querySelectorAll('.section-btn');
            
            // Set student name
            const studentName = localStorage.getItem('studentName') || 'Student Name';
            studentNameDisplay.textContent = studentName;
            
            // Section button events
            sectionButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const section = this.getAttribute('data-section');
                    
                    // Update status to in progress
                    const statusDot = this.parentElement.querySelector('.status-dot');
                    const statusText = this.parentElement.querySelector('.section-status span');
                    
                    statusDot.classList.add('in-progress');
                    statusText.textContent = 'In progress';
                    
                    // Show alert (in real app, this would open the section)
                    alert(`Starting ${section.replace(/([A-Z])/g, ' $1').toUpperCase()} section`);
                });
            });
        });