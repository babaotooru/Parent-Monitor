package com.parentcare.dto;

import java.util.List;

public class EmergencyAlertOutput {
    private String type;
    private String userName;
    private String time;
    private String location;
    private String status;
    private List<String> contactsNotified;
    private EmergencyResponse responseDetails;

    public static class EmergencyResponse {
        private String responseType;
        private String ambulanceStatus;
        private String nearestHospital;
        private String distance;
        private String estimatedArrival;
        private List<String> responders;

        public EmergencyResponse(String responseType, String ambulanceStatus, String nearestHospital,
                String distance, String estimatedArrival, List<String> responders) {
            this.responseType = responseType;
            this.ambulanceStatus = ambulanceStatus;
            this.nearestHospital = nearestHospital;
            this.distance = distance;
            this.estimatedArrival = estimatedArrival;
            this.responders = responders;
        }

        // Getters
        public String getResponseType() {
            return responseType;
        }

        public String getAmbulanceStatus() {
            return ambulanceStatus;
        }

        public String getNearestHospital() {
            return nearestHospital;
        }

        public String getDistance() {
            return distance;
        }

        public String getEstimatedArrival() {
            return estimatedArrival;
        }

        public List<String> getResponders() {
            return responders;
        }
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getContactsNotified() {
        return contactsNotified;
    }

    public void setContactsNotified(List<String> contactsNotified) {
        this.contactsNotified = contactsNotified;
    }

    public EmergencyResponse getResponseDetails() {
        return responseDetails;
    }

    public void setResponseDetails(EmergencyResponse responseDetails) {
        this.responseDetails = responseDetails;
    }
}
