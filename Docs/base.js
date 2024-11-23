 function toggleBackground() {
        const body = document.body;
        const button = document.querySelector(".toggle-button");
        if (body.classList.contains("dark-mode")) {
          body.classList.remove("dark-mode");
          button.innerText = "🌙";
        } else {
          body.classList.add("dark-mode");
          button.innerText = "🌞";
        }
      }

      fetch("https://api.github.com/repos/VR-Rathod/Code-Note/contents")
        .then((response) => response.json())
        .then((data) => {
          const repoList = document.getElementById("repo-list");
          data.forEach((file) => {
            if (file.name !== ".gitignore") {
              const listItem = document.createElement("li");
              listItem.innerHTML = `<a href="${file.html_url}" target="_blank"><span class="material-icons">insert_drive_file</span>${file.name}</a>`;
              repoList.appendChild(listItem);
            }
          });
        })
        .catch((error) =>
          console.error("Error fetching repository data:", error)
        );
      document.addEventListener("wheel", function (event) {
        if (event.deltaY) {
          window.scrollBy(0, event.deltaY);
        }
      });

      // JavaScript for handling the scroll buttons
      let gallery = document.querySelector(".gallery");
      let scrollAmount = 320; // Amount of pixels to scroll at once