<?php
require_once('../../../../include/config.php');
include '../../../../include/function-update.php';
include '../../../../include/finance-functions.php';
$location_id = $_POST['default_location'];
$Locations = GetLocations($link);
?>
<style>
    .action-button {
        height: 45px;
    }
</style>
<h4 class="border-bottom pb-2">Invoice Report</h4>
<form id="report-form" action="post">
    <div class="row">

        <div class="col-6 col-md-3">
            <label>From Date</label>
            <input type="date" class="form-control" name="from-date-input" id="from-date-input" value="<?= date('Y-m-d') ?>">
        </div>

        <div class="col-6 col-md-3">
            <label>To Date</label>
            <input type="date" class="form-control" name="to-date-input" id="to-date-input" value="<?= date('Y-m-d') ?>">
        </div>

        <div class="col-6 col-md-3">
            <label>Select Location</label>
            <select class="form-control" name="location_id" id="location_id" required autocomplete="off">
                <option value="">Select Location</option>
                <?php
                if (!empty($Locations)) {
                    foreach ($Locations as $SelectedArray) {
                        if ($SelectedArray['is_active'] != 1) {
                            continue;
                        }
                ?>

                        <option <?= ($SelectedArray['location_id'] == $location_id) ? 'selected' : '' ?> value="<?= $SelectedArray['location_id'] ?>"><?= $SelectedArray['location_name'] ?></option>
                <?php
                    }
                }
                ?>
            </select>
        </div>



        <div class="col-12 col-md-3 text-end">
            <p class="mb-0">Action</p>
            <button class="mb-0 btn action-button btn-dark view-button" type="button" onclick="PrintDayInvoiceReport()"><i class="fa-solid fa-print"></i> Print</button>
        </div>

    </div>
</form>