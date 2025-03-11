public with sharing class surveyController {
    @AuraEnabled
    public static void saveSurvey(String questions) {
        try {
            // Parse the JSON string back to a list of maps
            List<Object> questionListRaw = (List<Object>) JSON.deserializeUntyped(questions);
            
            // List to store all the survey question records
            List<Servey__c> surveyRecords = new List<Servey__c>();

            // Iterate over the list of questions
            for (Object questionDataRaw : questionListRaw) {
                Map<String, Object> questionData = (Map<String, Object>) questionDataRaw;
                
                // Create a new Servey__c record for each question
                Servey__c survey = new Servey__c();
                survey.Name = 'TOVO RESTAURANT SURVEY'; // Hardcoded survey name
                
                // Properly cast the Object to a String
                survey.Question__c = (String) questionData.get('question');
                survey.Answer__c = (String) questionData.get('answer');
                survey.Data_Type__c = (String) questionData.get('dataType');
                
                // Add the survey record to the list
                surveyRecords.add(survey);
            }
            
            // Insert all the survey question records in bulk
            insert surveyRecords;

        } catch (Exception e) {
            // Log the error and throw a custom exception to the front end
            System.debug('Error in saveSurvey: ' + e.getMessage());
            throw new AuraHandledException('Error saving survey: ' + e.getMessage());
        }
    }
}


