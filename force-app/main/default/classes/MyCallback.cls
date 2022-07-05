global with sharing class MyCallback implements SBQQ.CalculateCallback {
    global void callback(String quoteJSON){
      SBQQ.ServiceRouter.save('SBQQ.QuoteAPI.QuoteSaver', quoteJSON);
      Test__e myEvent = new Test__e();
      myEvent.Message__c = 'Callback just called.';
      EventBus.publish(myEvent);
    }
  }