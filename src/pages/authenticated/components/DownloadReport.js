import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DownloadReport = ({ ref }) => {
    const downloadPDF = async () => {
        const element = ref.current;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const margin = 10;
            const imgWidth = 210 - (2 * margin);
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = margin;

            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - (2 * margin));

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Dashboard-Report-${new Date().toLocaleDateString()}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
        }
    };

    return (
        <>
            <button onClick={downloadPDF} className="btn btn-danger btn-sm elevation-1 shadow-sm">
                <i className="fas fa-file-pdf mr-2"></i> Download PDF Report
            </button>
        </>
    )
}

export default DownloadReport