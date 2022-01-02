variable "fmp_api_key" {
  description = "FMP API Key to pull data from financialmodelingprep.com"
  sensitive   = true
}

variable "gcp_service_account" {
  description = "GCP application credentials"
  sensitive   = true
}