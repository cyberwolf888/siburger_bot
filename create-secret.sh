#!/bin/bash

# Create Secret Manager secret for SiBurger Bot environment variables
# This script creates a single secret containing all environment variables

SECRET_NAME="siburger-bot-env"
PROJECT_ID="your-project-id"  # Replace with your actual project ID

# Create the environment variables content
# Replace the values below with your actual values
cat > temp_env_vars << EOF
BOT_TOKEN=your_actual_bot_token_here
NODE_ENV=production
PORT=3000
FIREBASE_PRIVATE_KEY=your_actual_private_key_here
FIREBASE_CLIENT_EMAIL=your_actual_client_email_here
FIREBASE_DATABASE_ID=your_actual_database_id_here
FIREBASE_PROJECT_ID=your_actual_firebase_project_id_here
EOF

echo "Creating secret '$SECRET_NAME' in project '$PROJECT_ID'..."

# Create the secret
gcloud secrets create $SECRET_NAME \
    --project=$PROJECT_ID \
    --data-file=temp_env_vars

# Clean up temporary file
rm temp_env_vars

echo "Secret '$SECRET_NAME' created successfully!"
echo ""
echo "To update the secret in the future, use:"
echo "gcloud secrets versions add $SECRET_NAME --data-file=your_env_file"
echo ""
echo "To verify the secret was created:"
echo "gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID"
