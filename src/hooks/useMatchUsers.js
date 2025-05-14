// hooks/useMatchUsers.js
import { useState, useEffect } from "react";
import axios from "axios";

export function useMatchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // swipe
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});

  // count swipe
  const [swipeCount, setSwipeCount] = useState(0);
  const [leftSwipes, setLeftSwipes] = useState(0);
  const [rightSwipes, setRightSwipes] = useState(0);

  // add state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(5); // Limit per page

  //Filter state
  const [filters, setFilters] = useState({
    sexual_preference: null,
    age_range: "18-80",
  });

  //Current user state
  const [currentUser, setCurrentUser] = useState(null);

  // Start load component mount
  useEffect(() => {
    // call first page
    fetchUsers(1);
    //console.log("useEffect in useMatchUsers hook executed");
  }, []);

  //useEffect check filter change
  useEffect(() => {
    fetchUsers(1);
    //console.log("Filters changed:", filters);
  }, [filters]);

  // Fetch Users
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const currentUserId = "04d3a1ca-03c6-494b-8aa8-d13c2f93325a";

      let url = `/api/users?page=${page}&limit=${limit}&currentUserId=${currentUserId}`;

      if (filters.sexual_preference) {
        url += `&sexual_preference=${filters.sexual_preference}`;
      }

      if (filters.age_range) {
        url += `&age_range=${filters.age_range}`;
      }

      console.log("Fetching data from:", url);
      const response = await axios.get(url);
      console.log("API Response:", response.data);

      if (response.data && response.data.users) {
        if (page === 1) {
          setUsers(response.data.users);
          // Reset swipe counters after load first page
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);

          if (response.data.meta?.userSexualPreference && !filters.sexual_preference) {
            setFilters((prev) => ({
              ...prev,
              sexual_preference: response.data.meta.userSexualPreference,
            }));
          }
        } else {
          setUsers((prevUsers) => [...prevUsers, ...response.data.users]);
        }

        if (response.data.meta) {
          setTotalCount(response.data.meta.totalCount);
          setTotalPages(response.data.meta.totalPages);
          setCurrentPage(response.data.meta.page);

          if (response.data.meta.currentUser && !currentUser) {
            setCurrentUser(response.data.meta.currentUser);
          }
        }

        if (page === 1 && response.data.users.length > 0) {
          const firstUser = response.data.users[0];
          if (firstUser) {
            const newPerson = {
              name: firstUser.name,
              age: calculateAge(firstUser.date_of_birth),
              picture: firstUser.profile_image_url,
              city: firstUser.city,
              country: firstUser.location,
              bio: firstUser.bio,
              isMatch: firstUser.isMatch || false,
              originalProfile: firstUser,
            };
            setDisplayedUsers([newPerson]);
            setCurrentIndex(0);
          }
        }

        console.log("Users set to:", response.data.users);
      } else {
        console.log("No users data in response");
        if (page === 1) {
          setUsers([]);
          setDisplayedUsers([]);
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const loadNextUser = () => {
    if (!users || users.length === 0) {
      console.log("No users available");
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= users.length) {
      console.log("Need to load more users");

      // Check whether the next page should be loaded.
      if (currentPage < totalPages) {
        console.log(`Loading next page: ${currentPage + 1}`);
        fetchUsers(currentPage + 1);
        return;
      } else {
        //if last page and swipeCount = totalCount
        if (swipeCount >= totalCount - 1) {
          console.log("Reached the end, restarting from page 1");
          // reset swipe and load first page
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);
          fetchUsers(1);
          return;
        }

        // If the totalCount hasn't been reached yet but there are no more pages (special case).
        console.log("No more users to display");
        return;
      }
    }

    const user = users[nextIndex];
    console.log("Loading next user:", user);

    const age = calculateAge(user.date_of_birth);
    const newPerson = {
      name: user.name,
      age: age,
      picture: user.profile_image_url,
      city: user.city,
      country: user.location,
      bio: user.bio,
      isMatch: user.isMatch || false,
      originalProfile: user,
    };

    setDisplayedUsers((prev) => [...prev, newPerson]);
    setCurrentIndex(nextIndex);
  };

  const handleOutOfFrame = () => {
    console.log("Card out of frame");
  };

  // Change Click Arrow icon to change images
  const handleButtonClick = (e, userName, direction) => {
    e.stopPropagation();

    handleImageChange(userName, direction);
  };

  const handleImageChange = (userName, direction) => {
    const user = users.find((u) => u.name === userName);
    if (!user) return;

    const newImageIndexes = { ...imageIndexes };

    if (!newImageIndexes[userName]) {
      newImageIndexes[userName] = 1;
    }

    const imageUrls = [user.profile_image_url, user.image2_url, user.image3_url, user.image4_url, user.image5_url].filter(
      (url) => url !== null && url !== undefined
    );

    if (direction === "next") {
      newImageIndexes[userName] = newImageIndexes[userName] >= imageUrls.length ? 1 : newImageIndexes[userName] + 1;
    } else {
      newImageIndexes[userName] = newImageIndexes[userName] <= 1 ? imageUrls.length : newImageIndexes[userName] - 1;
    }

    setImageIndexes(newImageIndexes);
  };

  const handleHeartButton = (e, user) => {
    e.stopPropagation();
    console.log("Heart button clicked for", user.name);

    // Click heart then do swipe right
    handleSwipe("right", user);
  };

  // Swipe
  const handleSwipe = (direction, user) => {
    setLastDirection(direction);
    //console.log(`User swiped ${direction} for ${user.name}`);

    // count swipe
    setSwipeCount((prev) => prev + 1);

    // count swipe by directions
    if (direction === "left") {
      setLeftSwipes((prev) => prev + 1);
    } else if (direction === "right") {
      setRightSwipes((prev) => prev + 1);
    }

    // delete card after swipe
    setDisplayedUsers((prevUsers) => {
      const remaining = prevUsers.filter((item) => item.name !== user.name);
      //console.log("Remaining users after swipe:", remaining);
      return remaining;
    });

    // swipe right do Merry
    if (direction === "right") {
      console.log("Would record Merry for:", user.name);
      // ******* Call merry API Here ******
    }

    // If there are no cards left to display, load the next user.
    setTimeout(() => {
      if (displayedUsers.length <= 1) {
        loadNextUser();
      }

      // Check whether more data should be loaded
      // We should preload when the number of users left is getting low
      if (users.length - currentIndex <= 2) {
        // If the data is about to run out and there is still a next page
        if (currentPage < totalPages) {
          console.log(`Preloading next page: ${currentPage + 1}`);
          fetchUsers(currentPage + 1);
        }
      }

      // check to reload to homepage
      if (swipeCount >= totalCount && currentPage >= totalPages) {
        console.log("Reached the end of all users, restarting");

        setTimeout(() => {
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);
          fetchUsers(1);
        }, 500);
      }
    }, 300);
  };

  const setUserFilters = (newFilters) => {
    //console.log("Setting new filters:", newFilters);
    setFilters(newFilters);
  };

  const resetUsers = () => {
    //console.log("Resetting users and filters");

    setFilters((prev) => ({
      sexual_preference: prev.userSexualPreference || null,
      age_range: "18-80",
    }));
  };

  console.log("Current state:", {
    users: users.length,
    displayedUsers: displayedUsers.length,
    currentIndex,
    swipeCount,
    leftSwipes,
    rightSwipes,
    currentPage,
    totalPages,
    totalCount,
    filters,
    currentUser: currentUser?.username,
  });

  return {
    users,
    displayedUsers,
    currentIndex,
    lastDirection,
    imageIndexes,
    loading,
    error,
    swipeCount,
    leftSwipes,
    rightSwipes,
    currentPage,
    totalPages,
    totalCount,
    filters,
    currentUser,
    handleSwipe,
    handleOutOfFrame,
    handleButtonClick,
    handleHeartButton,
    setUserFilters,
    resetUsers,
  };
}
