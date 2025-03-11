import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class Assignment_3 extends LightningElement {
    @api recordId; // ID of the Contact to display

    // Define the fields to display in the form
    fields = ['FirstName', 'LastName', 'Email'];

    // Handle form submission success
    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact updated successfully!',
                variant: 'success'
            })
        );
    }

    // Handle form submission error
    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error updating Contact',
                message: event.detail.message,
                variant: 'error'
            })
        );
    }

}