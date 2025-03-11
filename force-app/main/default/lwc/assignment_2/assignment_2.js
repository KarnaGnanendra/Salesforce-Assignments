import { LightningElement, track } from 'lwc';
import saveSurvey from '@salesforce/apex/surveyController.saveSurvey';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class Assignment_2 extends LightningElement {
    @track questions = [];
    @track newQuestion = { question: '', dataType: '', answer: '', isText: false, isNumber: false, isCheckbox: false, isDropdown: false };
    nextQuestionId = 1;
 
    // Data type options for combobox
    dataTypeOptions = [
        { label: 'Text', value: 'Text' },
        { label: 'Number', value: 'Number' },
        { label: 'Checkbox', value: 'Checkbox' },
        { label: 'Dropdown', value: 'Dropdown' }
    ];
 
    // Dropdown options for answers
    dropdownOptions = [
        { label: 'Bad', value: 'Bad' },
        { label: 'Very Bad', value: 'Very Bad' },
        { label: 'Average', value: 'Average' },
        { label: 'Good', value: 'Good' },
        { label: 'Excellent', value: 'Excellent' }
    ];
 
    // Checkbox options for answers
    checkboxOptions = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];
 
    // Handle new question input change
    handleNewQuestionInputChange(event) {
        const field = event.target.dataset.field;
        this.newQuestion[field] = event.target.value;
 
        // Conditionally display the answer field based on the selected data type
        if (field === 'dataType') {
            this.newQuestion.isText = this.newQuestion.dataType === 'Text';
            this.newQuestion.isNumber = this.newQuestion.dataType === 'Number';
            this.newQuestion.isCheckbox = this.newQuestion.dataType === 'Checkbox';
            this.newQuestion.isDropdown = this.newQuestion.dataType === 'Dropdown';
        }
    }
 
    // Add new question
    handleAddQuestion() {
        const newQ = { ...this.newQuestion, id: this.nextQuestionId }; // Add unique ID to the new question
 
        // Add the new question to the list of questions
        this.questions = [...this.questions, newQ];
 
        // Increment the next question ID
        this.nextQuestionId += 1;
 
        // Reset the new question input fields
        this.newQuestion = { question: '', dataType: '', answer: '', isText: false, isNumber: false, isCheckbox: false, isDropdown: false };
    }
 
    // Remove a question
    handleCancelQuestion(event) {
        const questionId = parseInt(event.target.dataset.id, 10);
        this.questions = this.questions.filter(q => q.id !== questionId);
    }
 
    // Handle form submission
  async handleSubmit() {
        // Ensure there are questions to save
       if (this.questions.length === 0) {
          this.showToast('Error', 'Please add at least one question before submitting the survey.', 'error');
          return; // Prevent submission
      }
 
        try {
            // Call the Apex method to save all questions in a single survey record
            await saveSurvey({ questions: JSON.stringify(this.questions) });
 
            this.showToast('Success', 'Survey successfully added!', 'success');
            this.clearForm(); // Clear the form after submission
        } catch (error) {
            console.error('Error saving survey:', error);
            this.showToast('Error', 'Error saving survey: ' + error.body.message, 'error'); // Show error message
        }
    }
 
    // Show toast notification
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            })
        );
    }
 
    // Clear form fields after submission
    clearForm() {
        this.questions = [];
        this.nextQuestionId = 1;
    }

}