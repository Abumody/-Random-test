document.addEventListener('DOMContentLoaded', function() {
            const studentNameDisplay = document.getElementById('studentName');
            const logoutBtn = document.getElementById('logoutBtn');
            
            // Check if student is logged in
            const studentName = localStorage.getItem('studentName');
            if (!studentName) {
                // Redirect to login if not logged in
                alert('Please login first');
                window.location.href = 'index.html';
                return;
            }
            
            // Display student name
            studentNameDisplay.textContent = studentName;
            
            // Logout functionality
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        localStorage.removeItem('studentName');
                        window.location.href = 'index.html';
                    }
                });
            }
        });
