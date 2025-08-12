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
      // Si pasa correo en url: clean localStorage, save localStorage, load to globalStore using url email
      console.log('Email from URL parameter:', email);
      localStorage.clear(); // Clean all localStorage including cart and wishlist
      localStorage.setItem("postore_email", JSON.stringify(email)); // Save new email
      await BusinessDataLoader.loadBusinessData(email);
    } else {
      // Si no, busque localStorage y use
      const storedEmail = localStorage.getItem("postore_email");
      if (storedEmail) {
        email = JSON.parse(storedEmail);
        console.log('Email from localStorage:', email);
        await BusinessDataLoader.loadBusinessData(email);
      } else {
        // Si no hay localStorage entonces use default
        const defaultEmail = "pabloandreychacon@hotmail.com";
        console.log('Using default email:', defaultEmail);
        localStorage.setItem("postore_email", JSON.stringify(defaultEmail));
        await BusinessDataLoader.loadBusinessData(defaultEmail);
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