import React from "react";
import { Box, Typography } from "@mui/material";
import NewSubscriptionPlanStep from "./NewSubscriptionPlanStep";

/**
 * Legacy SubscriptionPlanStep component - now redirects to NewSubscriptionPlanStep
 * This component is kept for backward compatibility
 * 
 * For specific use cases, use:
 * - NewSubscriptionPlanStep for new subscriptions  
 * - RenewalSubscriptionPlanStep for renewals
 * - AddChildrenSubscriptionPlanStep for adding children
 */
const SubscriptionPlanStep = (props) => {
  // Log usage for monitoring
  if (process.env.NODE_ENV === 'development') {
    console.warn('SubscriptionPlanStep is deprecated. Use specific components instead:', {
      NewSubscription: 'NewSubscriptionPlanStep',
      Renewal: 'RenewalSubscriptionPlanStep', 
      AddChildren: 'AddChildrenSubscriptionPlanStep'
    });
  }

  // Handle legacy mode props
  if (props.isRenewalMode) {
    return (
      <Box sx={{ p: 2, border: '2px solid orange', borderRadius: 2, mb: 2 }}>
        <Typography color="warning.main" variant="body2">
          Warning: Please use RenewalSubscriptionPlanStep for renewal functionality
        </Typography>
      </Box>
    );
  }

  if (props.isAddChildrenMode) {
    return (
      <Box sx={{ p: 2, border: '2px solid orange', borderRadius: 2, mb: 2 }}>
        <Typography color="warning.main" variant="body2">
          Warning: Please use AddChildrenSubscriptionPlanStep for add children functionality
        </Typography>
      </Box>
    );
  }

  // Default to new subscription behavior
  return <NewSubscriptionPlanStep {...props} />;
};

export default SubscriptionPlanStep;