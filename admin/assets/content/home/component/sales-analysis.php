<?php
// Fetch total sales for all types
$totalSales = getInvoicesByDateAllByLocation($link, $today, $defaultLocation);
$totalReceipts = getReceiptsByDateAllFilterDatedByLocation($link, $today, $defaultLocation);
$creditSales = $totalSales - $totalReceipts;
// Fetch data for cash and credit card payments
$query = "SELECT SUM(`amount`) as sum, type FROM transaction_receipt WHERE `type` IN (0, 1) AND DATE(`current_time`) = '$today' AND `is_active` = 1 AND `today_invoice` = 1 AND `location_id` LIKE '$defaultLocation' GROUP BY type";
$result = mysqli_query($link, $query);

// Initialize arrays for labels and data
$labels = array();
$dataPoints = array();

// Populate arrays with data
while ($row = mysqli_fetch_assoc($result)) {
    switch ($row['type']) {
        case 0:
            $labels[] = 'Cash';
            break;
        case 1:
            $labels[] = 'Credit Card';
            break;
        default:
            $labels[] = 'Other';
    }

    // Add total sales to the data points array
    $dataPoints[] = $row['sum'];
}
$labels[] = 'Credit';
$dataPoints[] = $creditSales;
?>

<canvas id="paymentChart" width="100" height=100"></canvas>


<script>
    var ctx2 = document.getElementById('paymentChart').getContext('2d');
    var paymentChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: <?php echo json_encode($labels); ?>,
            datasets: [{
                data: <?php echo json_encode($dataPoints); ?>,
                backgroundColor: ['rgba(84, 67, 133, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 0, 0, 1)', 'rgba(255, 255, 255, 0.7)'],
            }]
        },
        options: {
            responsive: true,
        }
    });
</script>