<?php
require_once('../include/config.php');
include '../include/function-update.php';
require_once '../vendor/autoload.php';

$Locations = GetLocations($link);
$CompanyInfo = GetCompanyInfo($link);
$Products = GetProducts($link);
$Units = GetUnit($link);


use Symfony\Component\HttpClient\HttpClient;

$client = HttpClient::create();
$dotenv = Dotenv\Dotenv::createImmutable('../');
$dotenv->load();

$client = HttpClient::create();




$invoice_number = isset($_GET['invoiceNumber']) && $_GET['invoiceNumber'] !== '' ? $_GET['invoiceNumber'] : null;

// Check if the required parameter is not set or has an empty value
if ($invoice_number === null) {
    die("Invalid request. Please provide the 'invoiceNumber' parameter with a non-empty value.");
}

// Rest of your code goes here...

$SelectedInvoice = GetInvoices($link)[$invoice_number];
$InvProducts = GetInvoiceItems($link, $invoice_number);
$Units = GetUnit($link);

$response = $client->request('GET', $_ENV['SERVER_URL'] . '/addresses/by-invoice/' . $invoice_number);
// Check if the response status code is 404
if ($response->getStatusCode() === 404) {
    // If 404, set $productImages as an empty array
    $invoiceAddresses = [];
} else {
    // Otherwise, parse the response body as an array
    $invoiceAddresses = $response->toArray();
}


$response = $client->request('GET', $_ENV['SERVER_URL'] . '/invoices/' . $invoice_number);
// Check if the response status code is 404
if ($response->getStatusCode() === 404) {
    // If 404, set $productImages as an empty array
    $InvoiceInfo = [];
} else {
    // Otherwise, parse the response body as an array
    $InvoiceInfo = $response->toArray();
}


$pageTitle = "Invoice  - " . $invoice_number;
$reportTitle = "Invoice";

$taxAmount = $shippingAmount = $otherAmount = 0;
$CustomerID = $SelectedInvoice['customer_code'];
// $Customer = GetCustomersByID($link, $CustomerID);

$discountPercentage = $SelectedInvoice['discount_percentage'];
$discountAmount = $SelectedInvoice['discount_amount'];

$ref_hold = $SelectedInvoice['ref_hold'];
if ($ref_hold == '0') {
    // $referenceText = "Take Away";
    $referenceText = "Direct";
} else if ($ref_hold == '-1') {
    // $referenceText = "Retail";
    $referenceText = "Direct";
} else if ($ref_hold == '-2') {
    // $referenceText = "Delivery";
    $referenceText = "Direct";
} else if ($ref_hold == "") {
    // $referenceText = "None";
    $referenceText = "Direct";
} else {
    $referenceText = $ref_hold;
}


$InvoiceDate = $SelectedInvoice['current_time'];
$dateTime = new DateTime($InvoiceDate);
$formattedDate = $dateTime->format('d/m/Y H:i:s');


$LocationName = $Locations[$SelectedInvoice['location_id']]['location_name'];

if ($InvoiceInfo['invoice_status'] == "Paid") {
    $paymentState = "Paid";
} else {
    $paymentState = "COD";
}

$billingAddress = $invoiceAddresses['billing'];
$shippingAddress = $invoiceAddresses['shipping'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?> - <?= $billingAddress['first_name'] ?> <?= $billingAddress['last_name'] ?></title>

    <!-- Favicons -->
    <link href="../assets/images/favicon/apple-touch-icon.png" rel="icon">
    <link href="../assets/images/favicon/apple-touch-icon.png" rel="apple-touch-icon">

    <!-- CSS -->
    <link rel="stylesheet" href="../assets/css/report-viewer.css">
</head>

<body>
    <div class="invoice">
        <div id="container">
            <div id="left-section">
                <h3 class="company-title"><?= $CompanyInfo['company_name'] ?></h3>
                <p><?= $CompanyInfo['company_address'] ?>, <?= $CompanyInfo['company_address2'] ?></p>
                <p><?= $CompanyInfo['company_city'] ?>, <?= $CompanyInfo['company_postalcode'] ?></p>
                <p>Tel: <?= $CompanyInfo['company_telephone'] ?>/ <?= $CompanyInfo['company_telephone2'] ?></p>
                <p>Email: <?= $CompanyInfo['company_email'] ?></p>
                <p>Web: <?= $CompanyInfo['website'] ?></p>
            </div>

            <div id="right-section">
                <h2 class="report-title-mini"><?= strtoupper($reportTitle) ?></h2>
                <table>
                    <tr>
                        <th>Date</th>
                        <td class="text-end"><?= $formattedDate ?></td>
                    </tr>
                    <tr>
                        <th>INV Number</th>
                        <td class="text-end"><?= strtoupper($invoice_number) ?></td>
                    </tr>

                    <tr>
                        <th>Location</th>
                        <td class="text-end"><?= strtoupper($LocationName) ?></td>
                    </tr>

                    <tr>
                        <th>Ref Number</th>
                        <td class="text-end"><?= strtoupper($referenceText) ?></td>
                    </tr>

                    <tr>
                        <th>Payment</th>
                        <td class="text-end"><?= strtoupper($SelectedInvoice['payment_status']) ?></td>
                    </tr>

                </table>
            </div>

        </div>
        <div id="container" class="section-2">
            <div id="left-section">
                <h3 class="sub-title">Billing Info</h3>
                <p class="text-bold-extra"><?= $CustomerID ?></p>
                <p class="text-bold-extra"><?= isset($billingAddress['first_name']) ? $billingAddress['first_name'] : $CustomerID  ?> <?= isset($billingAddress['last_name']) ? $billingAddress['last_name'] : ""  ?></p>
                <p>
                    <?= isset($billingAddress['address_line1']) ? $billingAddress['address_line1'] : '' ?>
                    <?= isset($billingAddress['address_line2']) ? ', ' . $billingAddress['address_line2'] : '' ?>
                    <?= isset($billingAddress['city']) ? ', ' . $billingAddress['city'] : '' ?>
                </p>
                <p>
                    Tel: <?= isset($billingAddress['phone']) ? $billingAddress['phone'] : 'N/A' ?>
                </p>
                <p>
                    Email: <?= isset($billingAddress['user_id']) ? $billingAddress['user_id'] : 'N/A' ?>
                </p>

            </div>

            <div id="right-section">
                <h3 class="sub-title">Shipping Info</h3>
                <p class="text-bold-extra"><?= isset($shippingAddress['first_name']) ? $shippingAddress['first_name'] : $CustomerID  ?> <?= isset($shippingAddress['last_name']) ? $shippingAddress['last_name'] : ""  ?></p>

                <p>
                    <?= isset($shippingAddress['address_line1']) ? $shippingAddress['address_line1'] : '' ?>
                    <?= isset($shippingAddress['address_line2']) ? ', ' . $shippingAddress['address_line2'] : '' ?>
                    <?= isset($shippingAddress['city']) ? ', ' . $shippingAddress['city'] : '' ?>
                </p>
                <p>
                    Tel: <?= isset($shippingAddress['phone']) ? $shippingAddress['phone'] : 'N/A' ?>
                </p>
                <p>
                    Email: <?= isset($shippingAddress['user_id']) ? $shippingAddress['user_id'] : 'N/A' ?>
                </p>
            </div>
        </div>

        <div id="container" class="section-4">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Discount</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Item Start -->
                    <?php
                    if (!empty($InvProducts)) {
                        $SubTotal = $rawNumber = 0;
                        foreach ($InvProducts as $selectedArray) {

                            $taxAmount = $shippingAmount = $otherAmount = 0;

                            $OrderDate = $selectedArray['added_date'];
                            $OrderQuantity = $selectedArray['quantity'];
                            $PerRate = $selectedArray['item_price'];
                            $ProductID = $selectedArray['product_id'];
                            $item_discount = $selectedArray['item_discount'];
                            $OrderUnit = $Units[$Products[$ProductID]['measurement']]['unit_name'];
                            $productName = $Products[$ProductID]['product_name'];

                            $lineTotal = ($PerRate - $item_discount) * $OrderQuantity;
                            $rawNumber++;
                            $SubTotal += $lineTotal;
                    ?>
                            <tr>
                                <td class="text-center"><?= $rawNumber ?></td>
                                <td><?= MakeFormatProductCode($ProductID) ?> - <?= $productName ?></td>
                                <td class="text-center"><?= $OrderUnit ?></td>
                                <td class="text-center"><?= number_format($OrderQuantity, 2) ?></td>
                                <td class="text-end"><?= number_format($PerRate, 2) ?></td>
                                <td class="text-end"><?= number_format($item_discount, 2) ?></td>
                                <td class="text-end total"><?= number_format($lineTotal, 2) ?></td>
                            </tr>
                    <?php
                        }
                    }
                    ?>



                    <!-- End of the Items -->
                    <tr>
                        <td colspan="5" class="align-top  border-top add-theme">
                            Comments & Special Instructions
                        </td>
                        <td class="text-bold no-border border-top">Sub Total</td>
                        <td class="text-end footer-border total border-top"><?= number_format($SubTotal, 2) ?></td>
                    </tr>


                    <tr>
                        <td colspan="5" rowspan="5" class="align-top no-border">
                            <?= $SelectedInvoice['remark'] ?>
                        </td>
                        <td class="no-border text-bold">Discount (<?= number_format($discountPercentage, 2) ?>%)</td>
                        <td class="text-end footer-border "><?= number_format($discountAmount, 2) ?></td>
                    </tr>

                    <tr>
                        <td class="text-bold no-border ">Charge</td>
                        <td class="text-end footer-border "><?= number_format($taxAmount, 2) ?></td>
                    </tr>
                    <tr>
                        <td class="text-bold no-border ">Shipping</td>
                        <td class="text-end footer-border "><?= number_format($shippingAmount, 2) ?></td>
                    </tr>

                    <tr>
                        <td class="text-bold no-border ">Other</td>
                        <td class="text-end footer-border "><?= number_format($otherAmount, 2) ?></td>
                    </tr>

                    <?php
                    // Calculate the Total Amount
                    $TotalAmount = ($SubTotal - $discountAmount) + $taxAmount + $shippingAmount + $otherAmount;
                    ?>
                    <tr>
                        <td class="text-bold-extra no-border border-top-double">Total</td>
                        <td class="text-bold-extra  text-end footer-border border-top-double total"><?= number_format($TotalAmount, 2) ?></td>
                    </tr>
                </tbody>
            </table>


        </div>

        <div id="container" class="section-6" style="margin-top: 60px;">
            <div class="signature-box">
                <p>..................................</p>
                <p class="text-bold">Checked by</p>
            </div>
            <div class="signature-box">
                <p>..................................</p>
                <p class="text-bold">Authorized by</p>
            </div>
            <div class="signature-box">
                <p>..................................</p>
                <p class="text-bold">Received by</p>
            </div>
        </div>

        <script>
            window.print();

            // // Close the window after printing
            // window.onafterprint = function() {
            //     window.close();
            // };
        </script>
    </div>

</body>

</html>