// Shared business data loader for all pages
class BusinessDataLoader {
  static async loadBusinessData(email) {
    try {
      console.log('Loading business data for email:', email);
      
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }
      
      const { data, error } = await supabase
        .from("Settings")
        .select("*")
        .eq("Email", email);

      if (error) {
        console.error("Error fetching business data from Supabase:", error);
        window.globalStore.setState({ Email: "pabloandreychacon@hotmail.com" });
        return;
      }

      if (data && data.length > 0) {
        console.log('Business data loaded:', data[0]);
        // Force update the globalStore with business data
        window.globalStore.state = { ...window.globalStore.state, ...data[0] };
        window.globalStore.notify();
        window.globalStore.persist();
        // Signal that business data is ready
        window.businessDataReady = true;
        // Dispatch event to notify components
        window.dispatchEvent(new CustomEvent('businessDataLoaded'));
      } else {
        console.log('No business data found for email:', email, 'keeping original email');
        window.globalStore.setState({ Email: email });
        window.businessDataReady = true;
        // Dispatch event to notify components
        window.dispatchEvent(new CustomEvent('businessDataLoaded'));
      }
      
      localStorage.setItem("postore_email", JSON.stringify(email));
    } catch (error) {
      console.error("Error loading business data:", error);
    }
  }

  static async initBusinessData() {
    // Wait for globalStore and supabase to be available
    if (!window.globalStore || !supabase) {
      setTimeout(() => BusinessDataLoader.initBusinessData(), 100);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get("email");
    
    if (email) {
      console.log('Loading business data from URL parameter:', email);
      await BusinessDataLoader.loadBusinessData(email);
    } else {
      // Get from storage
      const storedEmail = localStorage.getItem("postore_email");
      if (storedEmail) {
        email = JSON.parse(storedEmail);
        console.log('Loading business data from storage:', email);
        await BusinessDataLoader.loadBusinessData(email);
      } else {
        // Use default from globalStore (which is now set correctly)
        const currentEmail = window.globalStore.state.Email;
        if (currentEmail && currentEmail !== '') {
          console.log('Using default business email:', currentEmail);
          await BusinessDataLoader.loadBusinessData(currentEmail);
        }
      }
    }
  }
}

// Check for URL parameter immediately and initialize
const urlParams = new URLSearchParams(window.location.search);
const emailParam = urlParams.get("email");

if (emailParam) {
  // If there's a URL parameter, run immediately
  BusinessDataLoader.initBusinessData();
} else {
  // Otherwise, wait for globalState to be fully loaded
  setTimeout(() => {
    BusinessDataLoader.initBusinessData();
  }, 100);
}