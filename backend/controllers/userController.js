// Merge frontend cart with backend user cart
export const mergeCart = async (req, res) => {
  try {
    const incomingCart = req.body.cart; // Array from localStorage
    const user = req.user; // Provided by authMiddleware

    if (!Array.isArray(incomingCart)) {
      return res.status(400).json({ message: 'Cart must be an array.' });
    }

    // Map incoming items to object for easy lookup
    const incomingMap = new Map();
    for (let item of incomingCart) {
      if (!item.productId || !item.quantity) continue;
      incomingMap.set(item.productId, item.quantity);
    }

    // Merge logic
    const updatedCart = [...user.cart]; // clone user's current cart

    for (let [productId, quantity] of incomingMap) {
      const existingItem = updatedCart.find((item) => item.productId.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity; // add quantities
      } else {
        updatedCart.push({ productId, quantity });
      }
    }

    // Save
    user.cart = updatedCart;
    await user.save();

    res.status(200).json({ message: 'Cart merged successfully', cart: user.cart });
  } catch (err) {
    console.error('Error merging cart:', err);
    res.status(500).json({ message: 'Server error while merging cart.' });
  }
};