// Universal Login Handler
async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    sessionStorage.setItem('user', JSON.stringify(profile));
    redirectByRole(profile.role);
  } catch (err) {
    alert("লগইন ব্যর্থ হয়েছে: " + err.message);
  }
}

// Security Router Guard (Role Based Access Control)
function redirectByRole(role) {
  if (role === 'Admin' || role === 'Cook') {
    window.location.href = 'kitchen.html';
  } else if (role === 'Cashier' || role === 'Manager') {
    window.location.href = 'cashier.html';
  } else if (role === 'Waiter') {
    window.location.href = 'waiter.html';
  } else {
    alert("আপনার অ্যাকাউন্টে কোনো রোল নির্ধারণ করা নেই!");
  }
}

function checkPageAccess(allowedRoles) {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (!user) {
    window.location.href = 'index.html';
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    alert("আপনার এই প্যানেলে ঢোকার অনুমতি নেই!");
    window.location.href = 'index.html';
    return null;
  }

  return user;
}

async function logoutUser() {
  await supabase.auth.signOut();
  sessionStorage.removeItem('user');
  window.location.href = 'index.html';
}
