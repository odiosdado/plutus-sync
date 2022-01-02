resource "google_cloud_run_service" "default" {
  name     = "plutus-sync"
  location = "us-central1"
  template {
    spec {
      containers {
        image = "gcr.io/plutus-273220/plutus-sync"
        env {
          name  = "FMP_BASE_URL"
          value = "https://financialmodelingprep.com/api/v3/"
        }
        env {
          name = "FMP_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.fmp.secret_id
              key  = "latest"
            }
          }
        }
        env {
          name = "GOOGLE_APPLICATION_CREDENTIALS"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.gcp.secret_id
              key  = "latest"
            }
          }
        }
      }
    }
  }

  depends_on = [
    google_secret_manager_secret_version.gcp_data,
    google_secret_manager_secret_version.fmp_data,
  ]
}