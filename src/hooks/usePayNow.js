import axios from 'axios';

const usePayNow = () => {
    const Pay = async (amount, preUrl) => {
        try {
            const invoiceNumber = `INV-${Date.now()}`;
            const auth = btoa("pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah" + ':');

            const payload = {
                totalAmount: {
                    value: amount,
                    currency: 'PHP'
                },
                requestReferenceNumber: invoiceNumber,
                redirectUrl: {
                    success: `${preUrl}/?status=success`,
                    failure: `${preUrl}/?status=failed`,
                    cancel: `${preUrl}/?status=cancelled`
                }
            };

            const response = await axios.post('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', payload, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.redirectUrl) {
                window.location.replace(response.data.redirectUrl);
            }
        } catch (error) {
            alert("Failed to initialize payment gateway. Please try again");
        }
    }

    return { Pay };
}

export default usePayNow;