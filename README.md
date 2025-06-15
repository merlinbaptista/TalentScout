# TalentScout - AI Hiring Assistant

A Python-based AI hiring assistant built with Streamlit and OpenAI GPT models for conducting intelligent candidate screening interviews.

## Features

- **Smart Candidate Screening**: AI-powered questions tailored to candidate's tech stack
- **Multi-Role Support**: Works for software engineers, video editors, graphic designers, and any role
- **Context-Aware Conversations**: Maintains conversation flow throughout the screening process
- **Beautiful UI**: Modern dark theme with pink neon accents
- **Real-time Chat Interface**: Streamlit-powered responsive chat interface

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Get OpenAI API Key**:
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key for use in the application

3. **Run the Application**:
   ```bash
   streamlit run app.py
   ```

4. **Access the App**:
   - Open your browser to `http://localhost:8501`
   - Enter your OpenAI API key when prompted
   - Start the screening process

## How It Works

### Information Collection Phase
The AI assistant collects:
- Full Name & Contact Details
- Years of Experience  
- Desired Position
- Current Location
- Technical Stack/Skills

### Technical Assessment Phase
Based on the candidate's declared skills, the AI generates:
- Technology-specific questions
- Problem-solving scenarios
- Best practices discussions
- Role-specific assessments
- Experience validation questions

### Conversation Flow
1. **Greeting**: Welcome message and purpose explanation
2. **Data Collection**: Systematic gathering of candidate information
3. **Skill Assessment**: Technical questions based on declared tech stack
4. **Conclusion**: Professional wrap-up with next steps

## Supported Roles

- **Technical Roles**: Software Engineers, DevOps, Data Scientists, etc.
- **Creative Roles**: Video Editors, Graphic Designers, UI/UX Designers, etc.
- **Any Role**: The AI adapts questions based on the candidate's field

## Usage Tips

- Type "exit", "quit", or "bye" to end the conversation anytime
- Be specific about your tech stack for better-tailored questions
- The AI maintains context throughout the entire conversation
- Complete screening typically takes 5-7 minutes

## Technical Stack

- **Frontend**: Streamlit
- **AI Model**: OpenAI GPT-3.5-turbo
- **Language**: Python 3.8+
- **Styling**: Custom CSS with modern dark theme

## Security

- API keys are stored securely in session state
- No data is permanently stored
- All conversations are ephemeral

## Customization

The AI assistant can be customized by modifying the system prompt in the `generate_ai_response()` function to:
- Add specific company requirements
- Include additional screening criteria
- Modify conversation flow
- Add role-specific questions

## License

This project is open source and available under the MIT License.
