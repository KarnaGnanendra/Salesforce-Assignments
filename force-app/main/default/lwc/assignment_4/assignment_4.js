import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/contactController.getContacts'; // Apex method to fetch contacts
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 
// Fields for getRecord wire service
const CONTACT_FIELDS = ['Contact.FirstName', 'Contact.LastName', 'Contact.Email'];


export default class Assignment_4 extends LightningElement {
    @track contacts = []; // List of contacts
    @track contactOptions = []; // Options for the combobox
    @track selectedContactId; // Currently selected contact ID
    @track selectedContact = {}; // Currently selected contact data
 
    // Wire service to fetch the list of contacts
    @wire(getContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
            // Transform contacts into combobox options
            this.contactOptions = data.map(contact => ({
                label: contact.Name, // The contact name will be shown as the label in the combobox
                value: contact.Id // The contact ID is stored as the value
            }));
        } else if (error) {
            // Show an error notification if there's an issue fetching contacts
            this.showNotification('Error', 'Failed to load contacts', 'error');
        }
    }
 
    // Wire service to fetch the selected contact details
    @wire(getRecord, { recordId: '$selectedContactId', fields: CONTACT_FIELDS })
    wiredContact({ error, data }) {
        if (data) {
            this.selectedContact = {
                FirstName: data.fields.FirstName.value,
                LastName: data.fields.LastName.value,
                Email: data.fields.Email.value
            };
        } else if (error) {
            this.selectedContact = {};
            this.showNotification('Error', 'Failed to load contact details', 'error');
        }
    }
 
    // Handle the selection of a contact from the dropdown
    handleContactChange(event) {
        this.selectedContactId = event.detail.value;
    }
 
    // Handle form input changes
    handleInputChange(event) {
        const field = event.target.name;
        if (this.selectedContact) {
            this.selectedContact = { ...this.selectedContact, [field]: event.target.value };
        }
    }
 
    // Save updated contact details
    handleSave() {
        const fields = {
            Id: this.selectedContactId,// ID of the contact being updated
            FirstName: this.selectedContact.FirstName,// Updated First Name
            LastName: this.selectedContact.LastName,// Updated Last Name
            Email: this.selectedContact.Email// Updated Email
        };
 
        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                this.showNotification('Success', 'Contact updated successfully', 'success');
            })
            .catch(error => {
                this.showNotification('Error', 'Failed to update contact', 'error');
            });
    }
 
    // Utility method to show notifications
    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

}