terraform {
  cloud {
    organization = "oddevs"
    workspaces {
      name = "pltutus-sync-google"
    }
  }
}