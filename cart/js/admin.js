// Admin Panel JavaScript
class AdminPanel {
  constructor() {
    this.isAuthenticated = false;
    this.products = [];
    this.orders = [];
    this.init();
  }

  async init() {
    // Wait for business data
    if (!window.businessDataReady) {
      setTimeout(() => this.init(), 100);
      return;
    }

    const businessEmail = window.globalStore?.state?.Email;
    document.getElementById("businessEmail").textContent =
      businessEmail || "No business email";

    // Check if already authenticated
    if (sessionStorage.getItem("adminAuth") === "true") {
      this.showAdminPanel();
    }
  }

  showAdminPanel() {
    this.isAuthenticated = true;
    document.getElementById("authSection").classList.add("d-none");
    document.getElementById("adminPanel").classList.remove("d-none");
    this.loadProducts();
    this.loadOrders();
  }

  async loadProducts() {
    try {
      // Get email from authentication or fall back to globalStore
      const adminEmail = document.getElementById("adminEmail")?.value;
      const businessEmail = adminEmail || window.globalStore?.state?.Email;
      console.log("Loading products for business email:", businessEmail);
      if (!businessEmail) {
        console.warn("No business email available for loading products");
        return;
      }

      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("BusinessEmail", businessEmail)
        .eq("Active", true)
        .order("Name");

      if (error) throw error;

      this.products = data || [];
      this.renderProductSelect();
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  renderProductSelect() {
    const select = document.getElementById("productSelect");
    select.innerHTML =
      '<option value="">Select a product...</option>' +
      this.products
        .map((p) => `<option value="${p.Id}">${p.Name}</option>`)
        .join("");

    select.addEventListener("change", (e) => {
      if (e.target.value) {
        this.loadExistingMedia(e.target.value);
      }
    });
  }

  async loadExistingMedia(productId) {
    try {
      const businessEmail = window.globalStore?.state?.Email;
      console.log(
        "Loading media for ProductId:",
        productId,
        "BusinessEmail:",
        businessEmail
      );

      const { data, error } = await supabase
        .from("ProductMedia")
        .select("*")
        .eq("BusinessEmail", businessEmail)
        .eq("ProductId", parseInt(productId))
        .order("DisplayOrder", { ascending: true });

      if (error) throw error;

      const container = document.getElementById("existingMedia");
      if (!data || data.length === 0) {
        container.innerHTML =
          '<p class="text-muted">No additional media found.</p>';
        return;
      }

      container.innerHTML =
        "<h6>Existing Media:</h6>" +
        data
          .map(
            (media) => `
          <div class="mb-2 p-2 border rounded">
            <div class="d-flex justify-content-between align-items-center">
              <span>${media.MediaType}: ${media.MediaUrl.split(
              "/"
            ).pop()}</span>
              <button class="btn btn-sm btn-outline-danger" onclick="adminPanel.deleteMedia(${
                media.Id
              })">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        `
          )
          .join("");
    } catch (error) {
      console.error("Error loading existing media:", error);
    }
  }

  async uploadMedia() {
    const productId = document.getElementById("productSelect").value;
    const fileInput = document.getElementById("mediaFile");
    const file = fileInput.files[0];

    if (!productId || !file) {
      this.showStatus("Please select a product and file", "danger");
      return;
    }

    // Check file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      this.showStatus("File size must be less than 1MB", "danger");
      return;
    }

    // Check existing media count
    // Get email from authentication or fall back to globalStore
    const adminEmail = document.getElementById("adminEmail")?.value;
    const businessEmail = adminEmail || window.globalStore?.state?.Email;
    const { data: existingMedia } = await supabase
      .from("ProductMedia")
      .select("Id")
      .eq("BusinessEmail", businessEmail)
      .eq("ProductId", parseInt(productId));

    if (existingMedia && existingMedia.length >= 5) {
      this.showStatus("Maximum 5 images allowed per product", "danger");
      return;
    }

    try {
      this.showStatus("Uploading...", "info");

      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      const businessName =
        window.globalStore?.state?.BusinessName ||
        (window.globalStore?.state?.Email
          ? window.globalStore.state.Email.split("@")[0].replace(
              /[^a-zA-Z0-9]/g,
              ""
            )
          : "default");
      const fileName = `${businessName}/${productId}/${Date.now()}_${
        file.name
      }`;

      console.log("Upload path:", fileName);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("postore")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("postore").getPublicUrl(fileName);

      // Save to ProductMedia table
      const businessEmail = window.globalStore?.state?.Email;
      console.log("Inserting with BusinessEmail:", businessEmail);

      const { error: insertError } = await supabase
        .from("ProductMedia")
        .insert({
          ProductId: parseInt(productId),
          MediaType: mediaType,
          MediaUrl: publicUrl,
          BusinessEmail: businessEmail,
          DisplayOrder: 0,
        });

      if (insertError) throw insertError;

      this.showStatus("Media uploaded successfully!", "success");
      fileInput.value = "";
      this.loadExistingMedia(productId);
    } catch (error) {
      console.error("Upload error:", error);
      this.showStatus("Upload failed: " + error.message, "danger");
    }
  }

  async deleteMedia(mediaId) {
    if (!confirm("Delete this media file?")) return;

    try {
      // Get email from authentication or fall back to globalStore
      const adminEmail = document.getElementById("adminEmail")?.value;
      const businessEmail = adminEmail || window.globalStore?.state?.Email;
      const { error } = await supabase
        .from("ProductMedia")
        .delete()
        .eq("BusinessEmail", businessEmail)
        .eq("ProductId", parseInt(productId));

      if (error) throw error;

      this.showStatus("Media deleted successfully!", "success");
      const productId = document.getElementById("productSelect").value;
      if (productId) this.loadExistingMedia(productId);
    } catch (error) {
      console.error("Delete error:", error);
      this.showStatus("Delete failed: " + error.message, "danger");
    }
  }

  async loadOrders() {
    try {
      // Get email from authentication or fall back to globalStore
      const adminEmail = document.getElementById("adminEmail")?.value;
      const businessEmail = adminEmail || window.globalStore?.state?.Email;
      console.log("Loading orders for business email:", businessEmail);
      if (!businessEmail) {
        console.warn("No business email available for loading orders");
        return;
      }

      const { data, error } = await supabase
        .from("Orders")
        .select("*")
        .eq("BusinessEmail", businessEmail)
        .order("CreatedAt", { ascending: false });

      if (error) throw error;

      this.orders = data || [];
      this.renderOrdersTable();
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  }

  renderOrdersTable() {
    const tbody = document.getElementById("ordersTable");

    if (this.orders.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="text-center text-muted">No orders found</td></tr>';
      return;
    }

    tbody.innerHTML = this.orders
      .map(
        (order) => `
      <tr>
        <td>#${order.Id}</td>
        <td>${order.BuyerEmail}</td>
        <td>$${order.TotalAmount}</td>
        <td>
          <span class="badge ${this.getStatusBadgeClass(order.StatusId)}">
            ${this.getStatusText(order.StatusId)}
          </span>
        </td>
        <td>${new Date(order.CreatedAt).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="adminPanel.viewOrderItems(${
            order.Id
          })">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary" onclick="adminPanel.editOrderDetails(${
            order.Id
          })">
            <i class="bi bi-pencil"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  async updateOrderStatus(orderId, statusId) {
    try {
      // Get email from authentication or fall back to globalStore
      const adminEmail = document.getElementById("adminEmail")?.value;
      const businessEmail = adminEmail || window.globalStore?.state?.Email;
      const { error } = await supabase
        .from("Orders")
        .update({ StatusId: parseInt(statusId), UpdatedAt: new Date() })
        .eq("Id", orderId);

      if (error) throw error;

      this.showStatus("Order status updated!", "success");
    } catch (error) {
      console.error("Error updating order:", error);
      this.showStatus("Update failed: " + error.message, "danger");
    }
  }

  async viewOrderItems(orderId) {
    try {
      const order = this.orders.find((o) => o.Id === orderId);
      const { data, error } = await supabase
        .from("OrderItems")
        .select("*")
        .eq("OrderId", order.PaymentOrderId);

      if (error) throw error;

      const items = data || [];
      const itemsHtml = items
        .map(
          (item) =>
            `<li>${item.ProductName} - Qty: ${item.Quantity} - $${item.ItemTotal}</li>`
        )
        .join("");

      this.showOrderItemsModal(orderId, items);
    } catch (error) {
      console.error("Error loading order items:", error);
    }
  }

  showOrderItemsModal(orderId, items) {
    const modalHtml = `
      <div class="modal fade" id="orderItemsModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Order #${orderId} Items</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              ${
                items.length === 0
                  ? "<p>No items found</p>"
                  : items
                      .map(
                        (item) => `
                  <div class="border-bottom pb-2 mb-2">
                    <strong>${item.ProductName}</strong><br>
                    <small>Quantity: ${item.Quantity} | Price: $${item.Price} | Total: $${item.ItemTotal}</small>
                  </div>
                `
                      )
                      .join("")
              }
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal
    const existingModal = document.getElementById("orderItemsModal");
    if (existingModal) existingModal.remove();

    // Add new modal
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    const modal = new bootstrap.Modal(
      document.getElementById("orderItemsModal")
    );
    modal.show();
  }

  editOrderDetails(orderId) {
    const order = this.orders.find((o) => o.Id === orderId);
    const deliveryDate = order.EstimatedDeliveryDate
      ? new Date(order.EstimatedDeliveryDate).toISOString().split("T")[0]
      : "";

    const modalHtml = `
      <div class="modal fade" id="editOrderModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Order #${orderId}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Status:</label>
                <select class="form-select" id="statusId">
                  <option value="0" ${
                    order.StatusId === 0 ? "selected" : ""
                  }>Pending</option>
                  <option value="1" ${
                    order.StatusId === 1 ? "selected" : ""
                  }>Paid</option>
                  <option value="2" ${
                    order.StatusId === 2 ? "selected" : ""
                  }>Shipped</option>
                  <option value="3" ${
                    order.StatusId === 3 ? "selected" : ""
                  }>Delivered</option>
                  <option value="4" ${
                    order.StatusId === 4 ? "selected" : ""
                  }>Cancelled</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Tracking Number:</label>
                <input type="text" class="form-control" id="trackingNumber" value="${
                  order.TrackingNumber || ""
                }">
              </div>
              <div class="mb-3">
                <label class="form-label">Estimated Delivery Date:</label>
                <input type="date" class="form-control" id="deliveryDate" value="${deliveryDate}">
              </div>
              <div class="mb-3">
                <label class="form-label">Notes:</label>
                <textarea class="form-control" id="notes" rows="3">${
                  order.Notes || ""
                }</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="adminPanel.saveOrderDetails(${orderId})">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const existingModal = document.getElementById("editOrderModal");
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    const modal = new bootstrap.Modal(
      document.getElementById("editOrderModal")
    );
    modal.show();
  }

  async saveOrderDetails(orderId) {
    const statusId = document.getElementById("statusId").value;
    const trackingNumber = document.getElementById("trackingNumber").value;
    const deliveryDate = document.getElementById("deliveryDate").value;
    const notes = document.getElementById("notes").value;

    try {
      const { error } = await supabase
        .from("Orders")
        .update({
          StatusId: parseInt(statusId),
          TrackingNumber: trackingNumber || null,
          EstimatedDeliveryDate: deliveryDate || null,
          Notes: notes || null,
          UpdatedAt: new Date(),
        })
        .eq("Id", orderId);

      if (error) throw error;

      this.showStatus("Order details updated!", "success");
      bootstrap.Modal.getInstance(
        document.getElementById("editOrderModal")
      ).hide();
      this.loadOrders();
    } catch (error) {
      console.error("Error updating order details:", error);
      this.showStatus("Update failed: " + error.message, "danger");
    }
  }

  getStatusText(statusId) {
    const statuses = {
      0: "Pending",
      1: "Paid",
      2: "Shipped",
      3: "Delivered",
      4: "Cancelled",
    };
    return statuses[statusId] || "Unknown";
  }

  getStatusBadgeClass(statusId) {
    const classes = {
      0: "bg-warning",
      1: "bg-success",
      2: "bg-info",
      3: "bg-primary",
      4: "bg-danger",
    };
    return classes[statusId] || "bg-secondary";
  }

  showStatus(message, type) {
    const status = document.getElementById("uploadStatus");
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.classList.remove("d-none");

    setTimeout(() => {
      status.classList.add("d-none");
    }, 3000);
  }
}

// Authentication

// Initialize
let adminPanel;
document.addEventListener("DOMContentLoaded", function () {
  adminPanel = new AdminPanel();

  // Handle Enter key in password field
  document
    .getElementById("adminPassword")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        authenticate();
      }
    });
});
