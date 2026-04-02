import { ImageResponse } from 'next/og';
import { supabase } from '@/utils/supabase/client';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch talent data
    const { data: profile, error } = await supabase
      .from('Talents')
      .select('prenom, nom, avatar_url, categorie')
      .eq('slug', slug)
      .single();

    if (error || !profile) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#004d3d',
              color: 'white',
              fontFamily: 'sans-serif',
            }}
          >
            <h1 style={{ fontSize: 60, fontWeight: 'bold' }}>Beninease</h1>
            <p style={{ fontSize: 30 }}>Talent non trouvé</p>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const fullName = `${profile.prenom} ${profile.nom}`;
    
    // Construct absolute image URL
    let imageUrl = `https://beninease.space/placeholder-portrait.jpg`;
    if (profile.avatar_url) {
      if (profile.avatar_url.startsWith('http')) {
        imageUrl = profile.avatar_url;
      } else if (profile.avatar_url.startsWith('/')) {
        imageUrl = `https://beninease.space${profile.avatar_url}`;
      } else {
        const cleanPath = profile.avatar_url.startsWith('/') ? profile.avatar_url.slice(1) : profile.avatar_url;
        const bucketName = 'talents';
        const pathWithoutBucket = cleanPath.startsWith(`${bucketName}/`) 
          ? cleanPath.replace(`${bucketName}/`, '') 
          : cleanPath;

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${pathWithoutBucket}`;
      }
    } else {
      // Format prenom-nom.jpg dans le bucket 'talents' par défaut
      const fileName = `${profile.prenom.toLowerCase()}-${profile.nom.toLowerCase()}.jpg`;
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/talents/${fileName}`;
    }

    // Design
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#004d3d',
            backgroundImage: 'linear-gradient(to bottom right, #004d3d, #008751)',
            padding: '40px 60px',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Left Side: Avatar */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '60px',
            }}
          >
            <img
              src={imageUrl}
              alt={fullName}
              style={{
                width: '400px',
                height: '400px',
                borderRadius: '40px',
                objectFit: 'cover',
                border: '8px solid white',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Right Side: Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                color: '#E9B113',
                marginBottom: '20px',
              }}
            >
              Ambassadeur Beninease
            </div>
            <h1
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                lineHeight: 1.1,
              }}
            >
              {fullName}
            </h1>
            <div
              style={{
                fontSize: '32px',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '40px',
              }}
            >
              {profile.category}
            </div>
            
            <div
              style={{
                display: 'flex',
                backgroundColor: '#E8112D',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '28px',
                fontWeight: 'bold',
                boxShadow: '0 10px 20px rgba(232,17,45,0.3)',
                width: 'fit-content',
              }}
            >
              VOTE POUR MOI !
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                fontSize: '24px',
                opacity: 0.5,
                fontWeight: 'bold',
                letterSpacing: '2px',
              }}
            >
              BENINEASE.SPACE
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
