import { LightningElement } from 'lwc';
import read from '@salesforce/apex/myQuoteExample.read';
import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled,
} from 'lightning/empApi';

export default class EmpApiLWC extends LightningElement {
    channelName = '/event/Test__e';
    quoteId = 'a0q8Z00000BwzlpQAB';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    quoteLines;

    subscription = {};

    // Tracks changes to channelName text field
    handleChannelName(event) {
        this.channelName = event.target.value;
    }

    handleQuoteId(event) {
        this.quoteId = event.target.value;
    }

    handleFetch() {
        read({quoteId: this.quoteId})
        .then(quote => this.quoteLines = quote.lineItems)
        .catch(error => console.log(error));
    }

    // Initializes the component
    connectedCallback() {
        // Register error listener
        this.registerErrorListener();
    }

    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = (response) => {
            console.log(response.data.payload.Message__c);
            read({quoteId: this.quoteId})
            .then(quote => this.quoteLines = quote.lineItems)
            .catch(error => console.log(error));
            // Response contains the payload of the new message received
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            this.subscription = response;
            this.toggleSubscribeButton(true);
        });
    }

    // Handles unsubscribe button click
    handleUnsubscribe() {
        this.toggleSubscribeButton(false);

        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
            // Response is true for successful unsubscribe
        });
    }

    toggleSubscribeButton(enableSubscribe) {
        this.isSubscribeDisabled = enableSubscribe;
        this.isUnsubscribeDisabled = !enableSubscribe;
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}