public class myQuoteExample {
    
    @AuraEnabled
    public static QuoteModel read(Id quoteId){
        try {
            QuoteReader reader = new QuoteReader();
            QuoteModel quote = reader.read(quoteId);
            return quote;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
