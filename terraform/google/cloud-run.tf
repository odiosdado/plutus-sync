resource "google_cloud_run_service" "default" {
  name     = "plutus-sync"
  location = "us-central1"
  template {
    spec {
      containers {
        image = "gcr.io/plutus-273220/plutus-sync"
        volume_mounts {
          name       = "secrets-volume"
          mount_path = "/secrets"
        }
        env {
          name  = "FMP_BASE_URL"
          value = "https://financialmodelingprep.com/api/v3/"
        }
        env {
          name  = "GOOGLE_APPLICATION_CREDENTIALS"
          value = "/secrets/plutus-key.json"
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
      }
      volumes {
        name = "secrets-volume"
        secret {
          secret_name = google_secret_manager_secret.gcp.secret_id
          items {
            key  = "latest"
            path = "plutus-key.json"
          }
        }
      }
    }
    metadata {
      annotations = {
        "run.googleapis.com/cpu-throttling" = "false" // cpu always on
        "autoscaling.knative.dev/minScale" = "1" //min scaling
      }
    }
  }

  depends_on = [
    google_secret_manager_secret_version.gcp_data,
    google_secret_manager_secret_version.fmp_data,
  ]
}