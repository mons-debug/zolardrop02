// Diagnostic script to check products and their variants for potential conflicts
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
    console.log('=== PRODUCTS AND VARIANTS DIAGNOSTIC ===\n');

    try {
        // Get all products with their variants
        const products = await prisma.product.findMany({
            include: {
                variants: true
            },
            orderBy: { title: 'asc' }
        });

        console.log(`Total Products: ${products.length}\n`);

        const issues = [];

        for (const product of products) {
            console.log(`\n📦 PRODUCT: ${product.title}`);
            console.log(`   ID: ${product.id}`);
            console.log(`   SKU: ${product.sku}`);
            console.log(`   Price: ${product.priceCents / 100} MAD`);
            console.log(`   Stock: ${product.stock}`);
            console.log(`   Color: ${product.color || 'N/A'}`);
            console.log(`   SizeInventory: ${product.sizeInventory || 'N/A'}`);
            console.log(`   Category: ${product.category || 'N/A'}`);

            // Check images
            let productImages = [];
            try {
                productImages = product.images ? JSON.parse(product.images) : [];
                console.log(`   Images: ${productImages.length} image(s)`);
                if (productImages.length === 0) {
                    issues.push(`❌ ${product.title}: No images`);
                }
            } catch (e) {
                console.log(`   Images: ERROR parsing - ${product.images}`);
                issues.push(`❌ ${product.title}: Invalid images JSON`);
            }

            console.log(`   Variants: ${product.variants.length}`);

            if (product.variants.length === 0) {
                console.log('   ⚠️  No variants - product uses direct stock/price');

                // Check if sizeInventory is set for products without variants
                if (!product.sizeInventory) {
                    issues.push(`⚠️  ${product.title}: No variants and no sizeInventory`);
                }
            }

            // Check each variant
            for (const variant of product.variants) {
                console.log(`\n   🎨 VARIANT: ${variant.color}`);
                console.log(`      ID: ${variant.id}`);
                console.log(`      SKU: ${variant.sku}`);
                console.log(`      Price: ${variant.priceCents / 100} MAD`);
                console.log(`      Stock: ${variant.stock}`);
                console.log(`      Size: ${variant.size || 'N/A'}`);
                console.log(`      SizeInventory: ${variant.sizeInventory || 'N/A'}`);
                console.log(`      ShowAsProduct: ${variant.showAsProduct}`);

                // Check variant images
                let variantImages = [];
                try {
                    variantImages = variant.images ? JSON.parse(variant.images) : [];
                    console.log(`      Images: ${variantImages.length} image(s)`);
                    if (variantImages.length === 0) {
                        issues.push(`⚠️  Variant ${variant.color} of ${product.title}: No images`);
                    }
                } catch (e) {
                    console.log(`      Images: ERROR parsing - ${variant.images}`);
                    issues.push(`❌ Variant ${variant.color} of ${product.title}: Invalid images JSON`);
                }

                // Check for duplicate SKUs
                const skuCount = await prisma.variant.count({
                    where: { sku: variant.sku }
                });
                if (skuCount > 1) {
                    issues.push(`❌ Duplicate variant SKU: ${variant.sku}`);
                }

                // Check for price mismatch
                if (variant.priceCents === 0) {
                    issues.push(`❌ Variant ${variant.color} of ${product.title}: Price is 0`);
                }
            }

            // Check for duplicate product SKUs
            const productSkuCount = await prisma.product.count({
                where: { sku: product.sku }
            });
            if (productSkuCount > 1) {
                issues.push(`❌ Duplicate product SKU: ${product.sku}`);
            }

            console.log('   ---');
        }

        console.log('\n\n=== POTENTIAL ISSUES FOUND ===\n');
        if (issues.length === 0) {
            console.log('✅ No issues found!');
        } else {
            issues.forEach(issue => console.log(issue));
        }

        // Check for orphaned variants (variants without valid product)
        console.log('\n\n=== CHECKING FOR ORPHANED DATA ===\n');
        const orphanedVariants = await prisma.variant.findMany({
            where: {
                product: null
            }
        });
        if (orphanedVariants.length > 0) {
            console.log(`❌ Found ${orphanedVariants.length} orphaned variants!`);
            orphanedVariants.forEach(v => console.log(`   - ${v.id}: ${v.color} (${v.sku})`));
        } else {
            console.log('✅ No orphaned variants');
        }

        // Check order checkout route logic
        console.log('\n\n=== CHECKOUT ROUTE ANALYSIS ===\n');
        console.log('The checkout route uses variantId to find items:');
        console.log('1. First tries to find Variant by id');
        console.log('2. If not found, tries to find Product by id (for variant-less products)');
        console.log('3. If product has variants, it throws error');
        console.log('4. If product has no variants, uses product directly');
        console.log('\nPotential conflict scenarios:');
        console.log('- When showAsProduct=true variant and parent product both appear in shop');
        console.log('- Cart might store productId but API expects variantId');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkProducts();
