import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const {
    to,
    subject,
    prospectName,
    propertyName,
    unitNumber,
    date,
    time,
    agent,
    recommendation,
  } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Tenant Assessment <onboarding@resend.dev>', 
      to: [to],
      subject: subject || 'Tenant Assessment Submission Confirmation',
      html: `
        <h1>Tenant Assessment Submitted</h1>
        <p>Dear ${prospectName},</p>
        <p>Your tenant assessment has been successfully submitted. Below are the details:</p>
        <ul>
          <li><strong>Property:</strong> ${propertyName}</li>
          <li><strong>Unit:</strong> ${unitNumber}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Agent:</strong> ${agent}</li>
          <li><strong>Recommendation:</strong> ${recommendation}</li>
        </ul>
        <p>Thank you for your submission!</p>
        <p>Best regards,<br>Dev Team</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data }, { status: 200 });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}