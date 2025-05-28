// Form handling JavaScript for My Purpose Summer Workshop
document.addEventListener('DOMContentLoaded', function() {
    // Handle allergy details
    const allergyRadios = document.querySelectorAll('input[name="allergies"]');
    const allergyDetails = document.getElementById('allergyDetails');
    
    allergyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                allergyDetails.style.display = 'block';
                allergyDetails.required = true;
            } else {
                allergyDetails.style.display = 'none';
                allergyDetails.required = false;
                allergyDetails.value = '';
            }
        });
    });

    // Handle medical condition details
    const medicalRadios = document.querySelectorAll('input[name="medicalConditions"]');
    const medicalDetails = document.getElementById('medicalDetails');
    
    medicalRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                medicalDetails.style.display = 'block';
                medicalDetails.required = true;
            } else {
                medicalDetails.style.display = 'none';
                medicalDetails.required = false;
                medicalDetails.value = '';
            }
        });
    });

    // Show form messages
    function showMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Insert at the top of the form
        form.insertBefore(messageDiv, form.firstChild);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Handle registration form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            try {
                // Disable button and show loading
                submitButton.disabled = true;
                submitButton.textContent = '📤 Submitting...';
                
                // Collect form data
                const formData = new FormData(this);
                const data = {};
                
                // Convert FormData to object
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                // Handle checkboxes for consent
                const consentCheckboxes = this.querySelectorAll('input[type="checkbox"]');
                consentCheckboxes.forEach(checkbox => {
                    data[checkbox.name] = checkbox.checked;
                });
                
                // Check if API is available (Vercel environment)
                try {
                    const response = await fetch('/api/submit-registration', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ data })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        showMessage(this, '✅ Registration submitted successfully! We will contact you soon.', 'success');
                        this.reset();
                    } else {
                        throw new Error(result.error || 'Failed to submit registration');
                    }
                } catch (apiError) {
                    // Fallback for static hosting - automatically send email and redirect
                    console.log('API not available, using email fallback method');
                    
                    // Format the data for email
                    const emailBody = `
REGISTRATION FORM SUBMISSION

Child's Information:
- Name: ${data.childName}
- Date of Birth: ${data.dateOfBirth}
- Age: ${data.age}
- Address: ${data.street}, ${data.city}, ${data.state} ${data.zip}, ${data.country}
- Allergies: ${data.allergies === 'yes' ? 'Yes - ' + (data.allergyDetails || 'Not specified') : 'No'}
- Medical Conditions: ${data.medicalConditions === 'yes' ? 'Yes - ' + (data.medicalDetails || 'Not specified') : 'No'}

Parent/Guardian Information:
- Name: ${data.parent1Name}
- Email: ${data.parent1Email}
- Phone: ${data.parent1Phone}

Consent Agreements:
- Participation: ${data.consentParticipation ? 'Agreed' : 'Not agreed'}
- Transportation: ${data.consentTransportation ? 'Agreed' : 'Not agreed'}
- Medical: ${data.consentMedical ? 'Agreed' : 'Not agreed'}
- Photos: ${data.consentPhotos ? 'Agreed' : 'Not agreed'}
- Liability: ${data.consentLiability ? 'Agreed' : 'Not agreed'}

Submitted on: ${new Date().toLocaleString()}
                    `.trim();
                    
                    // Create mailto link and automatically trigger it
                    const mailtoLink = `mailto:summerworkshops25@gmail.com?subject=Summer Workshop Registration - ${data.childName}&body=${encodeURIComponent(emailBody)}`;
                    
                    // Show success message
                    showMessage(this, '✅ Registration submitted successfully! Redirecting to payment...', 'success');
                    
                    // Automatically open email client
                    window.open(mailtoLink, '_blank');
                    
                    // Reset form
                    this.reset();
                    
                    // Redirect to payment page after a short delay
                    setTimeout(() => {
                        window.location.href = `payment.html?childName=${encodeURIComponent(data.childName)}`;
                    }, 2000);
                }
                
            } catch (error) {
                console.error('Registration error:', error);
                showMessage(this, `❌ Error: ${error.message}. Please try again or call 727-637-3362.`, 'error');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Handle volunteer form submission
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            try {
                // Disable button and show loading
                submitButton.disabled = true;
                submitButton.textContent = '📤 Submitting...';
                
                // Collect form data
                const formData = new FormData(this);
                const data = {};
                
                // Convert FormData to object
                for (let [key, value] of formData.entries()) {
                    if (key === 'availableDates') {
                        // Handle multiple checkboxes for available dates
                        if (!data[key]) data[key] = [];
                        data[key].push(value);
                    } else {
                        data[key] = value;
                    }
                }
                
                // Check if API is available (Vercel environment)
                try {
                    const response = await fetch('/api/submit-volunteer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ data })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        showMessage(this, '✅ Volunteer application submitted successfully! We will contact you soon.', 'success');
                        this.reset();
                    } else {
                        throw new Error(result.error || 'Failed to submit volunteer application');
                    }
                } catch (apiError) {
                    // Fallback for static hosting - create mailto link
                    console.log('API not available, using fallback method');
                    
                    // Format the data for email
                    const availableDatesText = data.availableDates ? data.availableDates.join(', ') : 'None selected';
                    
                    const emailBody = `
VOLUNTEER APPLICATION SUBMISSION

Volunteer Information:
- Name: ${data.volunteerName}
- Phone: ${data.volunteerPhone}
- Email: ${data.volunteerEmail}

Availability:
- Available Dates: ${availableDatesText}
- Preferred Time Slot: ${data.timeSlot}

Additional Information:
- Experience with Children: ${data.volunteerExperience || 'Not provided'}
- Interested Activities: ${data.volunteerInterests || 'Not provided'}

Submitted on: ${new Date().toLocaleString()}
                    `.trim();
                    
                    // Create mailto link
                    const mailtoLink = `mailto:summerworkshops25@gmail.com?subject=Summer Workshop Volunteer Application - ${data.volunteerName}&body=${encodeURIComponent(emailBody)}`;
                    
                    // Show success message with instructions
                    showMessage(this, '✅ Volunteer application completed! Please click the button below to send via email, or call 727-637-3362 to apply by phone.', 'success');
                    
                    // Create email button
                    const emailButton = document.createElement('a');
                    emailButton.href = mailtoLink;
                    emailButton.className = 'submit-button';
                    emailButton.style.display = 'inline-block';
                    emailButton.style.marginTop = '1rem';
                    emailButton.textContent = '📧 Send Volunteer Application Email';
                    
                    // Add button after the message
                    const message = this.querySelector('.form-message');
                    if (message) {
                        message.appendChild(document.createElement('br'));
                        message.appendChild(emailButton);
                    }
                    
                    this.reset();
                }
                
            } catch (error) {
                console.error('Volunteer application error:', error);
                showMessage(this, `❌ Error: ${error.message}. Please try again or call 727-637-3362.`, 'error');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
