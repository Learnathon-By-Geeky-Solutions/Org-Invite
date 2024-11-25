import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { configurations } from '@/lib/schema';

export async function POST(request: Request) {
  try {
    const { githubUsername } = await request.json();

    if (!githubUsername) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }

    // Get GitHub configuration
    const [config] = await db.select().from(configurations);
    
    if (!config?.githubToken || !config?.githubOrgName) {
      return NextResponse.json(
        { error: 'GitHub configuration not found' },
        { status: 400 }
      );
    }

    // Check if user is already a member of the organization
    const membershipRes = await fetch(
      `https://api.github.com/orgs/${config.githubOrgName}/members/${githubUsername}`,
      {
        headers: {
          'Authorization': `Bearer ${config.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    // If user is already a member, return accepted status
    if (membershipRes.status === 204) {
      return NextResponse.json({ status: 'accepted' });
    }

    // If user is not a member, check pending invitations
    const invitationsRes = await fetch(
      `https://api.github.com/orgs/${config.githubOrgName}/invitations`,
      {
        headers: {
          'Authorization': `Bearer ${config.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!invitationsRes.ok) {
      console.error('Failed to fetch invitations:', await invitationsRes.text());
      return NextResponse.json(
        { error: 'Failed to check invitation status' },
        { status: 500 }
      );
    }

    const invitations = await invitationsRes.json();
    
    // Find invitation for the specific user
    const userInvitation = invitations.find(
      (invite: any) => invite.login.toLowerCase() === githubUsername.toLowerCase()
    );

    // Return appropriate status
    return NextResponse.json({
      status: userInvitation ? 'pending' : null
    });

  } catch (error) {
    console.error('GitHub status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check GitHub status' },
      { status: 500 }
    );
  }
}