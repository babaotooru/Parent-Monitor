import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Card, CardContent, Chip, Box } from '@mui/material';
import { Notifications as NotificationIcon } from '@mui/icons-material';

const AlertNotifications = ({ userId, notifications = [] }) => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <NotificationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Notifications & Alerts
      </Typography>

      <Card sx={{ borderRadius: 3, mt: 3 }}>
        <CardContent>
          {notifications.length === 0 ? (
            <Typography>No notifications</Typography>
          ) : (
            <List>
              {notifications.map((notif, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={notif.message}
                    secondary={notif.timestamp?.toLocaleString()}
                  />
                  <Chip label={notif.type} size="small" />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AlertNotifications;
