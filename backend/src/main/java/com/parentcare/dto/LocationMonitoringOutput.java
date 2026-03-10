package com.parentcare.dto;

public class LocationMonitoringOutput {
    private LocationStatus locationStatus;
    private LocationAlert locationAlert;

    public static class LocationStatus {
        private String currentLocation;
        private String coordinates;
        private String lastMovement;
        private String gpsAccuracy;
        private boolean inSafeZone;
        private String address;

        public LocationStatus(String currentLocation, String coordinates, String lastMovement,
                String gpsAccuracy, boolean inSafeZone, String address) {
            this.currentLocation = currentLocation;
            this.coordinates = coordinates;
            this.lastMovement = lastMovement;
            this.gpsAccuracy = gpsAccuracy;
            this.inSafeZone = inSafeZone;
            this.address = address;
        }

        // Getters
        public String getCurrentLocation() {
            return currentLocation;
        }

        public String getCoordinates() {
            return coordinates;
        }

        public String getLastMovement() {
            return lastMovement;
        }

        public String getGpsAccuracy() {
            return gpsAccuracy;
        }

        public boolean isInSafeZone() {
            return inSafeZone;
        }

        public String getAddress() {
            return address;
        }
    }

    public static class LocationAlert {
        private String alertType;
        private String message;
        private String distanceFromHome;
        private String time;
        private String action;

        public LocationAlert(String alertType, String message, String distanceFromHome, String time, String action) {
            this.alertType = alertType;
            this.message = message;
            this.distanceFromHome = distanceFromHome;
            this.time = time;
            this.action = action;
        }

        // Getters
        public String getAlertType() {
            return alertType;
        }

        public String getMessage() {
            return message;
        }

        public String getDistanceFromHome() {
            return distanceFromHome;
        }

        public String getTime() {
            return time;
        }

        public String getAction() {
            return action;
        }
    }

    // Getters and Setters
    public LocationStatus getLocationStatus() {
        return locationStatus;
    }

    public void setLocationStatus(LocationStatus locationStatus) {
        this.locationStatus = locationStatus;
    }

    public LocationAlert getLocationAlert() {
        return locationAlert;
    }

    public void setLocationAlert(LocationAlert locationAlert) {
        this.locationAlert = locationAlert;
    }
}
