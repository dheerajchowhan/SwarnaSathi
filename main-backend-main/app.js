const express = require('express'); 
const dotenv = require('dotenv');  
const connectDB = require('./db/database.js');
const cors = require('cors');
const userRoutes = require('./routes/auth.routes.js');
const categoryRoutes = require('./routes/category.routes.js')
const bannerRoutes = require('./routes/banner.routes.js');
const productRoutes = require('./routes/product.routes.js');
const teamRoutes = require('./routes/team.routes.js')
const investorRoutes = require('./routes/investor.routes.js');
const newsletterRoutes = require('./routes/newsletter.routes.js');
const settingsRoutes = require('./routes/settings.routes.js')
const securityRoutes = require('./routes/security.routes.js')
const offersRoutes = require('./routes/offers.routes.js')
const mediaRoutes = require('./routes/media.routes.js')
const apiSettingsRoutes = require('./routes/apiSettings.routes.js')
const path = require('path')
dotenv.config();

const app = express();
app.use(cors({ origin: '*' }))

connectDB();
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api', bannerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/team',teamRoutes);
app.use('/api/investor-desk', investorRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/media', mediaRoutes );
app.use('/api/api-settings', apiSettingsRoutes );
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Something broke!'
    });
  });
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.get("/health", (req,res)=>{
    res.json({"message":"server healthy"});
  })
  


module.exports = app;
