import streamlit as st
import openai
from datetime import datetime
import time

# Configure the page
st.set_page_config(
    page_title="TalentScout - AI Hiring Assistant",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for styling
st.markdown("""
<style>
    /* Import Inter font */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Global styles */
    * {
        font-family: 'Inter', sans-serif;
    }
    
    /* Main background */
    .stApp {
        background: linear-gradient(135deg, #000000 0%, #1a0a1a 100%);
        color: white;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Custom header */
    .main-header {
        background: rgba(17, 17, 17, 0.8);
        border: 1px solid rgba(236, 72, 153, 0.2);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 30px;
        backdrop-filter: blur(10px);
    }
    
    /* Welcome section styling */
    .welcome-container {
        background: rgba(17, 17, 17, 0.5);
        border: 1px solid rgba(236, 72, 153, 0.3);
        border-radius: 20px;
        padding: 40px;
        margin: 20px 0;
        backdrop-filter: blur(10px);
    }
    
    /* Feature cards */
    .feature-card {
        background: rgba(17, 17, 17, 0.3);
        border: 1px solid rgba(236, 72, 153, 0.2);
        border-radius: 12px;
        padding: 20px;
        margin: 10px 0;
        transition: all 0.3s ease;
    }
    
    .feature-card:hover {
        border-color: rgba(236, 72, 153, 0.4);
        transform: translateY(-2px);
    }
    
    /* Chat container */
    .chat-container {
        background: rgba(17, 17, 17, 0.2);
        border: 1px solid rgba(236, 72, 153, 0.2);
        border-radius: 20px;
        padding: 20px;
        margin: 20px 0;
        backdrop-filter: blur(10px);
        min-height: 600px;
    }
    
    /* Message styling */
    .user-message {
        background: linear-gradient(135deg, #ec4899, #a855f7);
        color: white;
        padding: 12px 16px;
        border-radius: 18px;
        margin: 10px 0;
        margin-left: 20%;
        box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);
    }
    
    .bot-message {
        background: rgba(55, 65, 81, 0.8);
        color: #f3f4f6;
        padding: 12px 16px;
        border-radius: 18px;
        margin: 10px 0;
        margin-right: 20%;
        border: 1px solid rgba(107, 114, 128, 0.5);
    }
    
    /* Button styling */
    .stButton > button {
        background: linear-gradient(135deg, #ec4899, #a855f7);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 12px 24px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 14px rgba(236, 72, 153, 0.25);
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }
    
    /* Input styling */
    .stTextInput > div > div > input {
        background: rgba(55, 65, 81, 0.5);
        border: 1px solid rgba(107, 114, 128, 0.5);
        border-radius: 12px;
        color: white;
        padding: 12px;
    }
    
    .stTextInput > div > div > input:focus {
        border-color: rgba(236, 72, 153, 0.5);
        box-shadow: 0 0 0 1px rgba(236, 72, 153, 0.3);
    }
    
    /* Gradient text */
    .gradient-text {
        background: linear-gradient(135deg, #ec4899, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
    }
    
    /* Pink glow effect */
    .pink-glow {
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
    }
    
    /* Status indicator */
    .status-active {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    /* Typing indicator */
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        background: rgba(55, 65, 81, 0.8);
        border-radius: 18px;
        margin: 10px 0;
        margin-right: 20%;
        border: 1px solid rgba(107, 114, 128, 0.5);
    }
    
    .typing-dot {
        width: 8px;
        height: 8px;
        background: #ec4899;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    .typing-dot:nth-child(3) { animation-delay: 0s; }
    
    @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'app_state' not in st.session_state:
    st.session_state.app_state = 'welcome'
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'conversation_context' not in st.session_state:
    st.session_state.conversation_context = ''
if 'openai_api_key' not in st.session_state:
    st.session_state.openai_api_key = ''

def add_message(text, sender):
    """Add a message to the conversation"""
    message = {
        'id': str(len(st.session_state.messages)),
        'text': text,
        'sender': sender,
        'timestamp': datetime.now()
    }
    st.session_state.messages.append(message)

def generate_ai_response(user_message, context, api_key):
    """Generate AI response using OpenAI"""
    try:
        client = openai.OpenAI(api_key=api_key)
        
        system_prompt = """You are TalentScout's AI hiring assistant. Your role is to conduct professional candidate screening interviews for any position (software engineer, video editor, graphic designer, etc.).

CONVERSATION FLOW:
1. Start by greeting the candidate and asking for their full name
2. Collect: email, phone, years of experience, desired position, location
3. Ask about their tech stack/skills relevant to their field
4. Generate 3-5 technical questions based on their specific skills
5. Conclude professionally with next steps

IMPORTANT RULES:
- Keep responses concise and professional
- Ask ONE question at a time
- Generate technical questions specific to their declared skills
- For creative roles (video editor, designer): ask about software, techniques, portfolio
- For technical roles: ask about programming languages, frameworks, tools
- End conversation gracefully when they say goodbye/exit/quit
- Maintain context throughout the conversation
- Be encouraging and professional

Current conversation context: """ + context + """

Respond as the AI hiring assistant would."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.7,
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"I'm experiencing technical difficulties: {str(e)}. Please check your OpenAI API key."

def display_welcome_page():
    """Display the welcome page"""
    # Header
    st.markdown("""
    <div class="main-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 40px;">💼</div>
            <div>
                <h1 class="gradient-text" style="margin: 0; font-size: 32px;">TalentScout</h1>
                <p style="margin: 0; color: #9ca3af;">AI-Powered Hiring Assistant</p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Hero Section
    st.markdown("""
    <div class="welcome-container">
        <div style="text-align: center; margin-bottom: 40px;">
            <h2 class="gradient-text" style="font-size: 48px; margin-bottom: 20px;">
                Smart Candidate Screening
            </h2>
            <p style="font-size: 20px; color: #d1d5db; max-width: 800px; margin: 0 auto; line-height: 1.6;">
                Experience our AI-powered screening process designed to efficiently evaluate candidates 
                across all roles - from software engineering to creative positions.
            </p>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Process Overview
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="feature-card">
            <h3 style="color: #ec4899; font-size: 24px; margin-bottom: 20px;">📋 Information Collection</h3>
            <ul style="color: #d1d5db; line-height: 1.8;">
                <li>• Full Name & Contact Details</li>
                <li>• Years of Experience</li>
                <li>• Desired Position</li>
                <li>• Current Location</li>
                <li>• Technical Stack</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="feature-card">
            <h3 style="color: #ec4899; font-size: 24px; margin-bottom: 20px;">🤖 AI-Generated Questions</h3>
            <ul style="color: #d1d5db; line-height: 1.8;">
                <li>• Technology-Specific Queries</li>
                <li>• Problem-Solving Scenarios</li>
                <li>• Best Practices Discussion</li>
                <li>• Role-Specific Assessment</li>
                <li>• Experience Validation</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
    
    # Features Grid
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="feature-card" style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">⚡</div>
            <h4 style="font-size: 18px; margin-bottom: 8px;">Smart Screening</h4>
            <p style="font-size: 14px; color: #9ca3af;">AI-powered questions tailored to your tech stack</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="feature-card" style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">⏱️</div>
            <h4 style="font-size: 18px; margin-bottom: 8px;">Quick Process</h4>
            <p style="font-size: 14px; color: #9ca3af;">Complete screening in 5-7 minutes</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="feature-card" style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">👥</div>
            <h4 style="font-size: 18px; margin-bottom: 8px;">Expert Analysis</h4>
            <p style="font-size: 14px; color: #9ca3af;">Professional evaluation of responses</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="feature-card" style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
            <h4 style="font-size: 18px; margin-bottom: 8px;">Context Aware</h4>
            <p style="font-size: 14px; color: #9ca3af;">Maintains conversation flow throughout</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Important Notes
    st.markdown("""
    <div class="feature-card">
        <h3 style="color: #ec4899; font-size: 24px; margin-bottom: 20px;">⭐ Important Notes</h3>
        <ul style="color: #d1d5db; line-height: 1.8;">
            <li>• You can type "exit", "quit", or "bye" at any time to end the conversation</li>
            <li>• All responses are validated for accuracy and completeness</li>
            <li>• Technical questions are generated based on your specific tech stack</li>
            <li>• The process maintains context throughout the entire conversation</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)
    
    # API Key Input
    st.markdown("### 🔑 OpenAI API Configuration")
    api_key = st.text_input(
        "Enter your OpenAI API Key:",
        type="password",
        placeholder="sk-...",
        help="Your API key is required to power the AI assistant. It's stored securely in your session."
    )
    
    if api_key:
        st.session_state.openai_api_key = api_key
        st.success("✅ API Key configured successfully!")
    
    # Start Button
    st.markdown("<br>", unsafe_allow_html=True)
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("⚡ Start Your Screening", use_container_width=True):
            if not st.session_state.openai_api_key:
                st.error("Please enter your OpenAI API key first!")
            else:
                st.session_state.app_state = 'chat'
                # Initialize conversation
                add_message(
                    "🌟 Welcome to TalentScout! I'm your AI hiring assistant.\n\n" +
                    "I'll help streamline your application process by gathering some essential information and assessing your skills through a brief conversation.\n\n" +
                    "Let's get started! Could you please tell me your full name?",
                    'bot'
                )
                st.session_state.conversation_context = "Started screening process, asked for full name"
                st.rerun()
    
    st.markdown("""
    <div style="text-align: center; margin-top: 20px;">
        <p style="color: #9ca3af;">Estimated completion time: 5-7 minutes</p>
    </div>
    """, unsafe_allow_html=True)

def display_chat_page():
    """Display the chat interface"""
    # Header
    col1, col2 = st.columns([3, 1])
    with col1:
        st.markdown("""
        <div class="main-header">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 32px;">💼</div>
                <div>
                    <h1 class="gradient-text" style="margin: 0; font-size: 24px;">TalentScout</h1>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">AI Screening in Progress</p>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        if st.button("← Back to Welcome", use_container_width=True):
            st.session_state.app_state = 'welcome'
            st.session_state.messages = []
            st.session_state.conversation_context = ''
            st.rerun()
    
    # Chat Container
    st.markdown('<div class="chat-container">', unsafe_allow_html=True)
    
    # Display Messages
    for message in st.session_state.messages:
        if message['sender'] == 'user':
            st.markdown(f"""
            <div class="user-message">
                <strong>You:</strong> {message['text']}
                <div style="font-size: 12px; opacity: 0.7; margin-top: 8px;">
                    {message['timestamp'].strftime('%H:%M')}
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="bot-message">
                <strong>🤖 AI Assistant:</strong> {message['text']}
                <div style="font-size: 12px; opacity: 0.7; margin-top: 8px;">
                    {message['timestamp'].strftime('%H:%M')}
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Input Form
    with st.form(key="chat_form", clear_on_submit=True):
        col1, col2 = st.columns([4, 1])
        with col1:
            user_input = st.text_input(
                "Your response:",
                placeholder="Type your response here...",
                label_visibility="collapsed"
            )
        with col2:
            submit_button = st.form_submit_button("Send 📤", use_container_width=True)
        
        if submit_button and user_input.strip():
            # Add user message
            add_message(user_input.strip(), 'user')
            
            # Update conversation context
            new_context = st.session_state.conversation_context + f"\nUser: {user_input.strip()}"
            st.session_state.conversation_context = new_context
            
            # Show typing indicator
            with st.spinner("AI is thinking..."):
                time.sleep(1)  # Simulate thinking time
                
                # Generate AI response
                ai_response = generate_ai_response(
                    user_input.strip(), 
                    new_context, 
                    st.session_state.openai_api_key
                )
                
                # Add AI response
                add_message(ai_response, 'bot')
                
                # Update context with AI response
                st.session_state.conversation_context = new_context + f"\nAI: {ai_response}"
            
            st.rerun()
    
    # Status Bar
    st.markdown("""
    <div style="margin-top: 30px; padding: 16px; background: rgba(17, 17, 17, 0.3); border-radius: 12px; border: 1px solid rgba(107, 114, 128, 0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #9ca3af;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <div class="status-active"></div>
                <span>AI Assistant Active</span>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
                <span>Powered by OpenAI</span>
                <span>⭐</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Main App Logic
def main():
    if st.session_state.app_state == 'welcome':
        display_welcome_page()
    else:
        display_chat_page()

if __name__ == "__main__":
    main()
