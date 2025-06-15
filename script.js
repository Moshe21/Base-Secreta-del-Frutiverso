document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartList = document.getElementById('cart-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const clearCartButton = document.getElementById('clearCart');
    let cart = [];

    // **FUNCIÓN showToast: DEFINIDA UNA SOLA VEZ Y AL INICIO**
    function showToast(message) {
        let toast = document.getElementById('toast');
        if (!toast) {
            console.error("El elemento #toast no se encontró en el DOM. Asegúrate de que está en tu HTML.");
            return;
        }

        toast.textContent = message;
        toast.classList.add('show');

        // Oculta el toast después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Function to update the cart display
    function updateCartDisplay() {
        cartList.innerHTML = ''; // Clear existing items
        let total = 0;

        if (cart.length === 0) {
            // Muestra un mensaje si el carrito está vacío
            const emptyMessageLi = document.createElement('li');
            emptyMessageLi.innerHTML = `<span style="font-style: italic; color: #888;">Tu cuartel está vacío. ¡Añade héroes frutales!</span>`;
            cartList.appendChild(emptyMessageLi);
        } else {
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                // Se agrega el botón "X" con un data-index para identificar qué ítem eliminar
                li.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                    <button class="remove-item-btn comic-btn" data-index="${index}">X</button>
                `;
                cartList.appendChild(li);
                total += item.price * item.quantity;
            });
        }

        cartTotalSpan.textContent = `$${total.toLocaleString('es-CO')}`;

        // Add event listeners to the remove buttons (debe ir aquí para elementos dinámicos)
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemIndex = parseInt(event.target.dataset.index);
                removeItemFromCart(itemIndex);
            });
        });
    }

    // Function to remove an item from the cart
    function removeItemFromCart(index) {
        if (index > -1 && index < cart.length) { // Asegurarse de que el índice es válido
            if (cart[index].quantity > 1) {
                cart[index].quantity--; // Reduce la cantidad si hay más de 1
            } else {
                cart.splice(index, 1); // Si solo hay 1, lo elimina del array
            }
            updateCartDisplay(); // Actualiza la visualización del carrito
            showToast('➖ ¡Un héroe frutal ha regresado a la base! '); // Muestra un mensaje
        }
    }

    // Add event listeners to "Agregar" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemName = event.target.dataset.name;
            const itemPrice = parseInt(event.target.dataset.price);

            const existingItemIndex = cart.findIndex(item => item.name === itemName);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
            }
            updateCartDisplay();
        });
    });

    // Modified checkout button event listener
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('🍇 Tu equipo frutal está incompleto. ¡Suma héroes a tu misión saludable! 🍓🦸‍♂️'); // Llama a la showToast global
            return;
        }

        // Mostrar el toast ANTES de la demora
        showToast('🛡️ Prepárate para contactar la base secreta del Frutiverso por WhatsApp y completar tu misión en 3 segundos... 📲🍏');

        // Retrasar el envío a WhatsApp por 3 segundos
        setTimeout(() => {
            // Prepare the message for WhatsApp
            let whatsappMessage = "📡 ¡Llamando al escuadrón frutal! Estoy listo para pedir mi arsenal vitamínico: 🍍🍌🍉\n\n";
            let totalOrderPrice = 0;

            cart.forEach(item => {
                whatsappMessage += `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toLocaleString('es-CO')})\n`;
                totalOrderPrice += item.price * item.quantity;
            });

            whatsappMessage += `\n ⚡ El valor de tu energía frutal acumulada es: 💰🍒 $${totalOrderPrice.toLocaleString('es-CO')}\n`;
            whatsappMessage += `\n🙌 ¡Gracias por tu apoyo al Frutiverso! 🌈🍊`;

            // Encode the message for the URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // WhatsApp number (asegúrate de que no tenga espacios, aunque en el ejemplo anterior ya lo corregí)
            const phoneNumber = '3115819568'; // Your WhatsApp number

            // Construct the WhatsApp URL
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(whatsappURL, '_blank');

            // Clear the cart AFTER opening WhatsApp
            cart = [];
            updateCartDisplay(); // Update the display to show an empty cart
        }, 3000); // 3000 milisegundos = 3 segundos
    });

    // Event listener para el botón "Limpiar Carrito"
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            cart = []; // Vaciar el carrito
            updateCartDisplay(); // Actualizar la vista para mostrar el carrito vacío
            showToast('🗑️ Tu cuartel general ha sido despejado. ¡Vuelve pronto por más héroes frutales! 🍍🍌'); // Llama a la showToast global
        });
    } else {
        console.warn("El botón con ID 'clearCart' no fue encontrado. Asegúrate de añadirlo en tu HTML.");
    }

    updateCartDisplay(); // Initial display of the empty cart
});