// Simple test to verify API endpoints work with seeded data
const http = require('http')

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method,
      headers
    }

    const req = http.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data)
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          })
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: data
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}

// Test suite
async function runTests() {
  console.log('🧪 Running API tests...\n')

  try {
    // Test 1: GET /api/products should return 4 products
    console.log('Test 1: GET /api/products')
    const productsResponse = await makeRequest('/api/products')
    console.log(`Status: ${productsResponse.statusCode}`)

    if (productsResponse.statusCode !== 200) {
      throw new Error(`Expected 200, got ${productsResponse.statusCode}`)
    }

    const { products, pagination } = productsResponse.data
    console.log(`Found ${products.length} products`)
    console.log(`Pagination: page ${pagination.page}/${pagination.pages}, total ${pagination.total}`)

    if (products.length !== 4) {
      throw new Error(`Expected 4 products, got ${products.length}`)
    }

    // Verify each product has variants
    products.forEach((product, index) => {
      console.log(`  Product ${index + 1}: ${product.title} (${product.sku}) - ${product.variants.length} variants`)
      if (product.variants.length !== 4) {
        throw new Error(`Product ${product.title} should have 4 variants, got ${product.variants.length}`)
      }
    })

    // Test 2: GET /api/products/:id for first product
    console.log('\nTest 2: GET /api/products/:id')
    const firstProduct = products[0]
    const productDetailResponse = await makeRequest(`/api/products/${firstProduct.id}`)
    console.log(`Status: ${productDetailResponse.statusCode}`)

    if (productDetailResponse.statusCode !== 200) {
      throw new Error(`Expected 200, got ${productDetailResponse.statusCode}`)
    }

    const { product } = productDetailResponse.data
    console.log(`Product: ${product.title} (${product.sku})`)
    console.log(`Variants: ${product.variants.length}`)

    if (product.variants.length !== 4) {
      throw new Error(`Product detail should have 4 variants, got ${product.variants.length}`)
    }

    console.log('\n✅ All tests passed!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Run tests
runTests()
