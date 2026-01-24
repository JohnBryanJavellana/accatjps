function showLoaderAnimation(){
    $(".loader").css('background-color', 'rgba(200, 200, 200, 0.319)');
    $(".loader").removeClass('hidden');
}

function initializeDateCount() {
    $("#start_date").on('change', function() {
        let sd = $(this).val();
        let ed = $('#end_date');
        ed.val('');
        ed.attr('min', sd);

        // Check if start date is Sunday
        let startDate = new Date(sd);
        if (startDate.getDay() === 0) { // 0 represents Sunday
            alert('Sunday is not allowed');
            $(this).val('');
        }

        $('#form_3').trigger('reset');
    });

    $("#end_date").on('change', function() {
        $('#form_3').trigger('reset');
        $('#overall_payment_container').addClass('sr-only');

        let startDate = new Date($("#start_date").val());
        let endDate = new Date($("#end_date").val());

        // Check if end date is Sunday
        if (endDate.getDay() === 0) { // 0 represents Sunday
            alert('Sunday is not allowed');
            $(this).val('');
            return;
        }

        $('#overall_payment_container').addClass('sr-only');

        let dateDiffInDays = getBusinessDays(startDate, endDate);
        $("#dayCount").text(`for ${dateDiffInDays} ${dateDiffInDays > 1 ? 'days' : 'day'}`);
    });

    // Function to calculate business days (excluding Sundays)
    function getBusinessDays(startDate, endDate) {
        let count = 0;
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            if (currentDate.getDay() !== 0) { // 0 represents Sunday
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    }

    $("#principal_amount").on('input', function() {
        let startDate = new Date($("#start_date").val());
        let endDate = new Date($("#end_date").val());
        let dailyAmountField = $("#daily_amount");
        let opc = $('#overall_payment_container');
        let op = $('#overall_payment');
        let dateDiffInDays = getBusinessDays(startDate, endDate);

        let principalAmount = parseFloat($(this).val());
        let grossAmountField = $("#gross_amount");

        if (dateDiffInDays > 0 && principalAmount) {
            let dailyAmount = principalAmount / dateDiffInDays;
            let grossAmount = dailyAmount * dateDiffInDays;
            let opAmount = grossAmount * 1.2;

            dailyAmountField.val((opAmount / dateDiffInDays).toFixed(2));
            grossAmountField.val(opAmount.toFixed(2));
            op.text(`₱${opAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            opc.removeClass('sr-only');
        } else {
            dailyAmountField.val('');
            grossAmountField.val('');
            op.text('');
            opc.addClass('sr-only');
        }
    });
}

window.initializeDateCount = initializeDateCount;