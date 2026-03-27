//! ======================= CLIENT SIDE FORM VALIDATION ====================== !//
(() => {
    "use strict";
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            },
            false
        );
    });
})();

//! ============================= FLASH MESSAGES ============================== !//
document.addEventListener("DOMContentLoaded", () => {
    const flashMessages = document.querySelectorAll(".flash-message");
    flashMessages.forEach((message) => {
        // Auto-hide
        setTimeout(() => {
            message.classList.add("flash-hide");
            setTimeout(() => message.remove(), 500);
        }, 3000);

        // Manual close
        const closeBtn = message.querySelector(".flash-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                message.classList.add("flash-hide");
                setTimeout(() => message.remove(), 500);
            });
        }
    });
});

//! ============================= INDEX PAGE STUFF ============================= !//

// Drag-to-scroll for filter bar
const filterContainer = document.getElementById("filters");

if (filterContainer) {
    let isDown = false;
    let startX;
    let scrollLeftPos;

    filterContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        filterContainer.style.cursor = "grabbing";
        startX = e.pageX - filterContainer.offsetLeft;
        scrollLeftPos = filterContainer.scrollLeft;
    });

    filterContainer.addEventListener("mouseleave", () => {
        isDown = false;
        filterContainer.style.cursor = "grab";
    });

    filterContainer.addEventListener("mouseup", () => {
        isDown = false;
        filterContainer.style.cursor = "grab";
    });

    filterContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - filterContainer.offsetLeft;
        const walk = (x - startX) * 2;
        filterContainer.scrollLeft = scrollLeftPos - walk;
    });
}

// Navbar blur on scroll
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        if (window.scrollY > 10) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
});

// Tax switch toggle
const taxSwitch = document.getElementById("flexSwitchCheckDefault");
if (taxSwitch) {
    const priceBefore = document.querySelectorAll(".price-before");
    const priceAfter = document.querySelectorAll(".price-after");
    taxSwitch.addEventListener("click", () => {
        const showAfterTax = taxSwitch.checked;
        for (let i = 0; i < priceBefore.length; i++) {
            priceBefore[i].style.display = showAfterTax ? "none" : "inline";
            priceAfter[i].style.display = showAfterTax ? "inline" : "none";
        }
    });
}

// Searchbar typewriter animation
const input = document.getElementById("animatedInput");
const placeholderText = "Where to next?";
let index = 0;

function typeWriter() {
    if (index <= placeholderText.length) {
        input.setAttribute(
            "placeholder",
            placeholderText.substring(0, index++)
        );
        setTimeout(typeWriter, 50);
    }
}
window.addEventListener("DOMContentLoaded", () => {
    if (input) typeWriter();
});

//! ============================ CATEGORY FILTER (INDEX) ============================ !//
async function filterByCategory(category) {
    try {
        history.pushState({}, "", `/listings?category=${category}`);
        const response = await fetch(`/listings?category=${category}`);
        const htmlText = await response.text();
        const tempDoc = new DOMParser().parseFromString(htmlText, "text/html");
        const newListings = tempDoc.querySelector(".row.row-cols-lg-3");
        document.querySelector(".row.row-cols-lg-3").innerHTML =
            newListings.innerHTML;

        attachTaxToggle();

        const taxSwitch = document.getElementById("flexSwitchCheckDefault");
        if (taxSwitch && taxSwitch.checked) {
            document
                .querySelectorAll(".price-before")
                .forEach((el) => (el.style.display = "none"));
            document
                .querySelectorAll(".price-after")
                .forEach((el) => (el.style.display = "inline"));
        }

        highlightSelectedCategory(category);
    } catch (error) {
        console.error("Error while filtering:", error);
    }
}

function highlightSelectedCategory(category) {
    document.querySelectorAll(".filter").forEach((filter) => {
        const cat = filter.querySelector("p").textContent.toLowerCase();
        filter.classList.toggle("active", cat === category);
    });
}

function setupCategoryFilters() {
    document.querySelectorAll(".filter").forEach((filter) => {
        filter.addEventListener("click", () => {
            const cat = filter.querySelector("p").textContent.toLowerCase();
            const isActive = filter.classList.contains("active");

            if (isActive) {
                history.pushState({}, "", `/listings`);
                fetch(`/listings`)
                    .then((res) => res.text())
                    .then((html) => {
                        const doc = new DOMParser().parseFromString(
                            html,
                            "text/html"
                        );
                        const newListings =
                            doc.querySelector(".row.row-cols-lg-3");
                        document.querySelector(".row.row-cols-lg-3").innerHTML =
                            newListings.innerHTML;

                        attachTaxToggle();

                        const taxSwitch = document.getElementById(
                            "flexSwitchCheckDefault"
                        );
                        if (taxSwitch && taxSwitch.checked) {
                            document
                                .querySelectorAll(".price-before")
                                .forEach((el) => (el.style.display = "none"));
                            document
                                .querySelectorAll(".price-after")
                                .forEach((el) => (el.style.display = "inline"));
                        }

                        document
                            .querySelectorAll(".filter")
                            .forEach((f) => f.classList.remove("active"));
                    });
            } else {
                filterByCategory(cat);
            }
        });
    });
}

function attachTaxToggle() {
    const taxSwitch = document.getElementById("flexSwitchCheckDefault");
    if (!taxSwitch) return;
    taxSwitch.addEventListener("click", () => {
        const showAfterTax = taxSwitch.checked;
        document
            .querySelectorAll(".price-before")
            .forEach(
                (el) => (el.style.display = showAfterTax ? "none" : "inline")
            );
        document
            .querySelectorAll(".price-after")
            .forEach(
                (el) => (el.style.display = showAfterTax ? "inline" : "none")
            );
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupCategoryFilters();
    attachTaxToggle();

    const currentCategory = new URLSearchParams(window.location.search).get(
        "category"
    );
    if (currentCategory) {
        highlightSelectedCategory(currentCategory);
    }

    // Hide tax toggle when footer is visible
    const taxToggleFloating = document.querySelector(".tax-toggle-floating");
    const footerElement = document.querySelector("footer");

    if (taxToggleFloating && footerElement) {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    taxToggleFloating.style.opacity = "0";
                    taxToggleFloating.style.pointerEvents = "none";
                } else {
                    taxToggleFloating.style.opacity = "1";
                    taxToggleFloating.style.pointerEvents = "auto";
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(footerElement);
    }
});

//! ============= LOGIC FOR THE NEW.EJS CATEGORY INPUT ============= !//
document.addEventListener("DOMContentLoaded", () => {
    const catInput = document.getElementById("categoryInput");
    const suggestions = document.getElementById("suggestions");
    const selectedContainer = document.getElementById("selectedCategories");
    const hiddenInput = document.getElementById("categoryHiddenInput");

    if (catInput && suggestions && selectedContainer && hiddenInput) {
        const allCategories = [
            "Pools",
            "Trending",
            "Farms",
            "Top Cities",
            "Camping",
            "Castles",
            "Skating",
            "Hotels",
            "Beach",
            "Igloos",
            "Mountains",
            "Rooms",
            "Ski-in/out",
            "Boats",
            "Creative spaces",
            "Caravans",
            "Arctic",
            "Nature",
            "Golfing",
            "Urban",
            "Cabins",
            "Snowboarding",
            "Luxury",
            "Cozy",
        ];

        let selectedCategories = [];

        catInput.addEventListener("input", function () {
            const value = this.value.toLowerCase();
            suggestions.innerHTML = "";
            if (!value) return;

            const filtered = allCategories.filter(
                (c) =>
                    c.toLowerCase().includes(value) &&
                    !selectedCategories.includes(c)
            );

            filtered.forEach((cat) => {
                const div = document.createElement("div");
                div.classList.add("list-group-item", "list-group-item-action");
                div.textContent = cat;
                div.onclick = () => {
                    selectedCategories.push(cat);
                    updateSelectedTags();
                    catInput.value = "";
                    suggestions.innerHTML = "";
                };
                suggestions.appendChild(div);
            });
        });

        function updateSelectedTags() {
            selectedContainer.innerHTML = "";
            selectedCategories.forEach((cat) => {
                const tag = document.createElement("span");
                tag.className = "tag";
                tag.innerHTML = `${cat} <span class="remove-tag">&times;</span>`;
                tag.querySelector(".remove-tag").onclick = () => {
                    selectedCategories = selectedCategories.filter(
                        (c) => c !== cat
                    );
                    updateSelectedTags();
                };
                selectedContainer.appendChild(tag);
            });
            hiddenInput.value = selectedCategories.join(",");
        }
    }
});

//! ======================== TITLE TAB CHANGE ======================== !//
const originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
    document.title =
        document.visibilityState === "hidden"
            ? "Come back to explore more!"
            : originalTitle;
});
