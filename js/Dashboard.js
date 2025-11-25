<script>
        document.addEventListener('DOMContentLoaded', function() {
            const studentNameDisplay = document.getElementById('studentName');
            const backBtn = document.getElementById('backBtn');
            
            // Check if student is logged in
            const studentName = localStorage.getItem('studentName');
            if (!studentName) {
                // Redirect to login if not logged in
                window.location.href = 'index.html';
                return;
            }
            
            // Display student name
            studentNameDisplay.textContent = studentName;
            
            // Back button functionality
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // You can customize this behavior:
                // Option 1: Go back in browser history
                window.history.back();
                
                // Option 2: Redirect to specific page
                // window.location.href = 'Dashboard.html';
                
                // Option 3: Show confirmation
                // if(confirm('Are you sure you want to go back to login?')) {
                //     window.location.href = 'index.html';
                // }
            });
        });