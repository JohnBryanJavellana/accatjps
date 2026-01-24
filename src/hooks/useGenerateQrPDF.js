import generatePDF, { Resolution, Margin } from 'react-to-pdf';

const useGenerateQrPDF = () => {
    const BATCH_SIZE = 30;

    const GenerateQrPDF = async (ref, data, callbackFunction) => {
        if (!ref || !data || data.length === 0) return;

        let queue = [...data];
        let batchIndex = 1;
        const totalBatches = Math.ceil(queue.length / BATCH_SIZE);

        while (queue.length > 0) {
            const currentBatch = queue.splice(0, BATCH_SIZE);
            
            callbackFunction({
                processMethod: `PREPARING BATCH ${batchIndex} OF ${totalBatches}...`,
                activeBatch: currentBatch,
                showLoader: true
            });

            let isReady = false;
            let attempts = 0;
            while (!isReady && attempts < 20) {
                const canvases = ref.current?.querySelectorAll('canvas');
                if (canvases && canvases.length >= currentBatch.length) {
                    isReady = true;
                } else {
                    await new Promise(res => setTimeout(res, 200));
                    attempts++;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); 

            try {
                await generatePDF(ref, {  
                    filename: `BATCH-${batchIndex}-QR-${Date.now()}.pdf`,
                    resolution: Resolution.NORMAL,
                    page: { margin: Margin.NONE, format: 'legal', orientation: 'landscape' }
                });
            } catch (error) {
                console.error("Batch Error:", error);
            }

            batchIndex++;
        }

        callbackFunction({ activeBatch: [], showLoader: false, hideModal: true });
    }

    return { GenerateQrPDF };
}

export default useGenerateQrPDF;