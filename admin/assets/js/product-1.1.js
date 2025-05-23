var UserLevel = document.getElementById("UserLevel").value;
var LoggedUser = document.getElementById("LoggedUser").value;
var company_id = document.getElementById("company_id").value;

$(document).ready(function () {
  OpenIndex();
});

var folder = "product";

// Take this
function OpenIndex() {
  document.getElementById("index-content").innerHTML = InnerLoader;

  function fetch_data() {
    $.ajax({
      url: "assets/content/" + folder + "/index.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        UserLevel: UserLevel,
      },
      success: function (data) {
        $("#index-content").html(data);
      },
    });
  }
  fetch_data();
}

function AddProduct(is_active, updateKey) {
  showOverlay();
  document.getElementById("index-content").innerHTML = InnerLoader;

  function fetch_data() {
    $.ajax({
      url: "assets/content/" + folder + "/create.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        company_id: company_id,
        is_active: is_active,
        updateKey: updateKey,
        UserLevel: UserLevel,
      },
      success: function (data) {
        $("#index-content").html(data);
        hideOverlay();
      },
    });
  }
  fetch_data();
}

function SaveProduct(is_active, UpdateKey) {
  showOverlay();
  var supplierList = document.querySelectorAll("#supplier_id");
  var checked = false;

  var availableLocations = document.querySelectorAll("#availableLocation");
  var LocationChecked = false;

  var form = document.getElementById("add-form");
  var product_description = tinymce.get("product_description").getContent();

  if (form.checkValidity()) {
    showOverlay();
    var formData = new FormData(form);
    formData.append("LoggedUser", LoggedUser);
    formData.append("UserLevel", UserLevel);
    formData.append("company_id", company_id);
    formData.append("is_active", is_active);
    formData.append("UpdateKey", UpdateKey);
    formData.append("product_description", product_description);

    function fetch_data() {
      $.ajax({
        url: "assets/content/" + folder + "/save.php",
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
          var response = JSON.parse(data);
          if (response.status === "success") {
            var result = response.message;
            OpenAlert("success", "Done!", result);
            OpenIndex();
          } else {
            var result = response.message;
            OpenAlert("error", "Oops.. Something Wrong!", result);
          }
          hideOverlay();
        },
      });
    }

    for (var i = 0; i < supplierList.length; i++) {
      if (supplierList[i].checked) {
        checked = true;
        break;
      }
    }

    for (var i = 0; i < availableLocations.length; i++) {
      if (availableLocations[i].checked) {
        LocationChecked = true;
        break;
      }
    }

    if (checked && LocationChecked) {
      fetch_data();
    }

    if (!checked) {
      result = "Please select at least one Supplier";
      hideOverlay();
      OpenAlert("error", "Oops!", result);
      return false;
    }

    if (!LocationChecked) {
      result = "Please select at least one Location";
      hideOverlay();
      OpenAlert("error", "Oops!", result);
      return false;
    }
  } else {
    form.reportValidity();
    result = "Please Filled out All * marked Fields.";
    OpenAlert("error", "Oops!", result);
    hideOverlay();
  }

  return true;
}

function ChangeStatus(IsActive, UpdateKey) {
  showOverlay();
  document.getElementById("index-content").innerHTML = InnerLoader;

  function fetch_data() {
    $.ajax({
      url: "assets/content/" + folder + "/change-status.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        company_id: company_id,
        IsActive: IsActive,
        UpdateKey: UpdateKey,
        UserLevel: UserLevel,
      },
      success: function (data) {
        var response = JSON.parse(data);
        if (response.status === "success") {
          var result = response.message;
          OpenAlert("success", "Done!", result);
          hideOverlay();
          OpenIndex();
        } else {
          var result = response.message;
          OpenAlert("error", "Oops.. Something Wrong!", result);
        }
      },
    });
  }
  fetch_data();
}

function SelectDepartments(
  sectionId,
  selectedDepartment = 0,
  selectedCategory = 0
) {
  showOverlay();

  function fetch_data() {
    $.ajax({
      url: "assets/content/" + folder + "/get-departments.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        company_id: company_id,
        sectionId: sectionId,
        selectedDepartment: selectedDepartment,
        selectedCategory: selectedCategory,
      },
      success: function (data) {
        $("#department_id").html(data);
        hideOverlay();

        SelectCategory(sectionId, selectedDepartment, selectedCategory);
      },
    });
  }
  fetch_data();
}

function SelectCategory(sectionId, departmentId, selectedCategory = 0) {
  showOverlay();

  function fetch_data() {
    $.ajax({
      url: "assets/content/" + folder + "/get-category.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        company_id: company_id,
        sectionId: sectionId,
        departmentId: departmentId,
        selectedCategory: selectedCategory,
      },
      success: function (data) {
        $("#category_id").html(data);
        hideOverlay();
      },
    });
  }
  fetch_data();
}

function UpdateProductImages(productId) {
  document.getElementById("loading-popup").innerHTML = InnerLoader;

  function fetch_data() {
    $.ajax({
      url: "assets/content/product/product-images.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        UserLevel: UserLevel,
        productId: productId,
      },
      success: function (data) {
        $("#loading-popup").html(data);
        OpenPopup();
      },
    });
  }
  fetch_data();
}

function SaveProductImages(productId, is_active = 1) {
  var form = document.getElementById("product-image-form");

  if (form.checkValidity()) {
    showOverlay();
    var formData = new FormData(form);
    formData.append("LoggedUser", LoggedUser);
    formData.append("UserLevel", UserLevel);
    formData.append("company_id", company_id);
    formData.append("productId", productId);
    formData.append("is_active", is_active);

    function fetch_data() {
      $.ajax({
        url: "assets/content/product/request/save-image.php",
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
          var response = JSON.parse(data);
          if (response.status === "success") {
            var result = response.message;
            OpenAlert("success", "Done!", result);
            ClosePopUP();

            UpdateProductImages(productId);
          } else {
            var result = response.message;
            OpenAlert("error", "Oops.. Something Wrong!", result);
          }
          hideOverlay();
        },
      });
    }
    fetch_data();
  } else {
    result = "Please Filled out All * marked Fields.";
    OpenAlert("error", "Oops!", result);
  }
}

function changeImageStatus(updateKey, IsActive, productId) {
  showOverlay();

  function fetch_data() {
    $.ajax({
      url: "assets/content/product/request/change-image-status.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        company_id: company_id,
        IsActive: IsActive,
        updateKey: updateKey,
        UserLevel: UserLevel,
      },
      success: function (data) {
        var response = JSON.parse(data);
        if (response.status === "success") {
          var result = response.message;
          OpenAlert("success", "Done!", result);
          hideOverlay();
          UpdateProductImages(productId);
        } else {
          var result = response.message;
          OpenAlert("error", "Oops.. Something Wrong!", result);
        }
      },
    });
  }
  fetch_data();
}

function DeleteImage(productId, ImageId) {
  showOverlay();

  function fetch_data() {
    $.ajax({
      url: "assets/content/product/request/delete-image.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        company_id: company_id,
        ImageId: ImageId,
        UserLevel: UserLevel,
      },
      success: function (data) {
        var response = JSON.parse(data);
        if (response.status === "success") {
          var result = response.message;
          OpenAlert("success", "Done!", result);
          hideOverlay();
          UpdateProductImages(productId);
        } else {
          var result = response.message;
          OpenAlert("error", "Oops.. Something Wrong!", result);
        }
      },
    });
  }
  fetch_data();
}

function UpdateEcomDescriptions(productId) {
  document.getElementById("loading-popup").innerHTML = InnerLoader;

  function fetch_data() {
    $.ajax({
      url: "assets/content/product/e-com-descriptions.php",
      method: "POST",
      data: {
        LoggedUser: LoggedUser,
        UserLevel: UserLevel,
        productId: productId,
      },
      success: function (data) {
        $("#loading-popup").html(data);
        OpenPopup();
      },
    });
  }
  fetch_data();
}

function SaveProductInfo(productId, is_active = 1) {
  var form = document.getElementById("product-info-form");

  if (form.checkValidity()) {
    showOverlay();
    var formData = new FormData(form);
    formData.append("LoggedUser", LoggedUser);
    formData.append("UserLevel", UserLevel);
    formData.append("company_id", company_id);
    formData.append("productId", productId);
    formData.append("is_active", is_active);

    function fetch_data() {
      $.ajax({
        url: "assets/content/product/request/save-product-info.php",
        method: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
          var response = JSON.parse(data);
          if (response.status === "success") {
            var result = response.message;
            OpenAlert("success", "Done!", result);
            ClosePopUP();
          } else {
            var result = response.message;
            OpenAlert("error", "Oops.. Something Wrong!", result);
          }
          hideOverlay();
        },
      });
    }
    fetch_data();
  } else {
    form.reportValidity();
    result = "Please Filled out All * marked Fields.";
    OpenAlert("error", "Oops!", result);
  }
}

function UpdateStockStatus(stockStatusCode, ProductId) {
  showOverlay(); // Show loading overlay

  // API Endpoint
  const url = `https://kduserver.payshia.com/products/${ProductId}/stock-status`;

  // Payload to be sent
  const requestData = {
    stock_status: stockStatusCode,
    LoggedUser: LoggedUser,
    UserLevel: UserLevel,
    company_id: company_id,
  };

  // Sending the PUT request
  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json()) // Convert response to JSON
    .then((data) => {
      if (data.message) {
        OpenIndex();
        OpenAlert("success", "Done!", data.message);
      } else {
        OpenAlert("error", "Oops.. Something Wrong!", data.error);
      }
    })
    .catch((error) => {
      OpenAlert("error", "Error!", "Failed to update stock status.");
      console.error("Error:", error);
    })
    .finally(() => {
      hideOverlay(); // Hide loading overlay
    });
}
