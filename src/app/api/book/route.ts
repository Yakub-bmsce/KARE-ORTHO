import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, service, message } = body;

    console.log('Received booking request:', { name, email, phone, date, service, message });

    // Validate fields
    if (!name || !phone || !date || !service) {
      return NextResponse.json(
        { error: 'Missing required booking fields (name, phone, date, service)' },
        { status: 400 }
      );
    }

    let emailSent = false;
    let whatsappSent = false;
    let isMock = false;

    // 1. Send Email Notification
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || '587';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || 'KARE Orthopaedics <noreply@kareorthopaedics.com>';
    const smtpTo = process.env.SMTP_TO || 'kareorthopaedics@gmail.com'; // Clinic admin email

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: smtpPort === '465',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        // HTML mail for clinic admin
        const adminMailOptions = {
          from: smtpFrom,
          to: smtpTo,
          subject: `🏥 New Appointment Booking - ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #00c9a7; border-bottom: 2px solid #00c9a7; padding-bottom: 10px;">New Appointment Booked</h2>
              <p>A new appointment has been scheduled from the KARE Orthopaedics website. Here are the details:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; width: 30%;">Patient Name:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Mobile Number:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email Address:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${email || 'Not Provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Preferred Date:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Specialty:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${service}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; vertical-align: top;">Notes:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${message || 'None'}</td>
                </tr>
              </table>
              <p style="margin-top: 25px; font-size: 11px; color: #888;">This request was processed automatically by KARE Orthopaedics Server Actions.</p>
            </div>
          `,
        };

        await transporter.sendMail(adminMailOptions);

        // If patient provided an email, send them a confirmation email
        if (email) {
          const patientMailOptions = {
            from: smtpFrom,
            to: email,
            subject: `🗓️ Your Appointment Confirmation - KARE Orthopaedics`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #00c9a7; margin: 0;">KARE Orthopaedics</h1>
                  <p style="text-transform: uppercase; font-size: 10px; tracking: 2px; color: #888; margin: 5px 0 0 0;">Bringing Mobility to Life</p>
                </div>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Thank you for scheduling your orthopaedic consultation with **Dr. Ajay N**. We are pleased to confirm that your appointment request has been received.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #00c9a7; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #333;">Appointment Details:</h3>
                  <p style="margin: 5px 0;"><strong>Specialty:</strong> ${service}</p>
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
                  <p style="margin: 5px 0;"><strong>OPD Consultation Fee:</strong> ₹500 (Payable at clinic)</p>
                  <p style="margin: 5px 0;"><strong>Address:</strong> 9th Main, 4th cross, Gururaja layout, Thyagaraja Nagar Circle, Bengaluru</p>
                </div>

                <p><strong>What happens next?</strong></p>
                <p>Our clinic coordinator will review your notes and contact you on <strong>${phone}</strong> shortly to finalize your specific slot timing. If you need to make changes or require immediate fracture care, please call us directly at <a href="tel:+918657641152" style="color: #00c9a7; font-weight: bold; text-decoration: none;">+91 86576 41152</a>.</p>
                
                <p style="margin-top: 30px; font-weight: bold;">Warm regards,</p>
                <p style="margin: 0; color: #555;">Clinic Team</p>
                <p style="margin: 0; color: #555;">KARE Orthopaedics, Bengaluru</p>
              </div>
            `,
          };
          await transporter.sendMail(patientMailOptions);
        }

        emailSent = true;
      } catch (err) {
        console.error('Nodemailer failed:', err);
      }
    } else {
      console.warn('SMTP environment variables are not set. Skipping real email delivery.');
      isMock = true;
    }

    // 2. Send WhatsApp Message Notification via Twilio
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFromWhatsapp = process.env.TWILIO_FROM_WHATSAPP || 'whatsapp:+14155238886'; // Twilio sandbox number
    const clinicWhatsapp = process.env.CLINIC_PHONE_WHATSAPP; // Admin whatsapp to receive alerts

    if (twilioSid && twilioAuthToken) {
      try {
        const client = twilio(twilioSid, twilioAuthToken);

        // Format phone number to E.164 if not already (e.g. +91...)
        let formattedPhone = phone.trim().replace(/\s+/g, '');
        if (!formattedPhone.startsWith('+')) {
          if (formattedPhone.length === 10) {
            formattedPhone = `+91${formattedPhone}`;
          } else if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
            formattedPhone = `+${formattedPhone}`;
          }
        }

        // Send to Patient
        await client.messages.create({
          from: twilioFromWhatsapp,
          to: `whatsapp:${formattedPhone}`,
          body: `Hello ${name}, your KARE Orthopaedics appointment is scheduled for ${date}. Specialty: ${service}. Our coordinator will contact you shortly to confirm your exact time. If you need immediate assistance, call +918657641152.`
        });

        // Send to Clinic Admin (if configured)
        if (clinicWhatsapp) {
          let formattedClinicPhone = clinicWhatsapp.trim().replace(/\s+/g, '');
          if (!formattedClinicPhone.startsWith('+')) {
            if (formattedClinicPhone.length === 10) {
              formattedClinicPhone = `+91${formattedClinicPhone}`;
            }
          }
          await client.messages.create({
            from: twilioFromWhatsapp,
            to: `whatsapp:${formattedClinicPhone}`,
            body: `🏥 NEW BOOKING: ${name} (${phone}) has scheduled an appointment for ${date}. specialty: ${service}. Notes: ${message || 'None'}`
          });
        }

        whatsappSent = true;
      } catch (err) {
        console.error('Twilio WhatsApp failed:', err);
      }
    } else {
      console.warn('Twilio environment variables are not configured. Skipping WhatsApp SMS.');
      isMock = true;
    }

    return NextResponse.json({
      success: true,
      emailSent,
      whatsappSent,
      isMock,
      message: isMock 
        ? 'Booking simulated successfully! Set SMTP and Twilio env variables to trigger live emails and WhatsApp messages.' 
        : 'Appointment booked! Confirmation Email and WhatsApp message dispatched successfully.'
    });

  } catch (error) {
    console.error('Error handling booking request:', error);
    return NextResponse.json(
      { error: 'Internal server error processing booking request' },
      { status: 500 }
    );
  }
}
