// Test de connexion à l'API Spring Boot
const testLogin = async () => {
  console.log('🔍 Test de connexion à l\'API Spring Boot...');
  
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@demo.com',
        password: 'password123'
      })
    });

    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login réussi !');
      console.log('Token:', data.token?.substring(0, 30) + '...');
      console.log('User:', data.firstName, data.lastName);
      console.log('Role:', data.role);
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur:', response.status, errorText);
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
};

testLogin();