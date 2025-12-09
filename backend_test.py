import requests
import sys
import json
from datetime import datetime

class ArchipelagoScentAPITester:
    def __init__(self, base_url="https://fragrant-isles.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.content else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_auth_flow(self):
        """Test authentication flow"""
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION")
        print("="*50)
        
        # Test admin login
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"✅ Token obtained: {self.token[:20]}...")
            
            # Test get current user
            self.run_test(
                "Get Current User",
                "GET", 
                "auth/me",
                200
            )
            return True
        else:
            print("❌ Failed to get authentication token")
            return False

    def test_islands_endpoints(self):
        """Test islands endpoints"""
        print("\n" + "="*50)
        print("TESTING ISLANDS ENDPOINTS")
        print("="*50)
        
        # Get all islands
        success, islands = self.run_test(
            "Get All Islands",
            "GET",
            "islands",
            200
        )
        
        if success and islands:
            print(f"✅ Found {len(islands)} islands")
            
            # Test get specific island
            first_island = islands[0]
            island_id = first_island.get('id')
            if island_id:
                self.run_test(
                    f"Get Island by ID ({island_id[:8]})",
                    "GET",
                    f"islands/{island_id}",
                    200
                )
                
                # Test update island (admin only)
                if self.token:
                    self.run_test(
                        f"Update Island ({island_id[:8]})",
                        "PUT",
                        f"admin/islands/{island_id}",
                        200,
                        data={"mood": "Updated Test Mood"}
                    )
            
            return islands
        else:
            print("❌ No islands found")
            return []

    def test_products_endpoints(self):
        """Test products endpoints"""
        print("\n" + "="*50)
        print("TESTING PRODUCTS ENDPOINTS")
        print("="*50)
        
        # Get all products
        success, products = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        
        if success and products:
            print(f"✅ Found {len(products)} products")
            
            # Test get specific product
            first_product = products[0]
            product_id = first_product.get('id')
            if product_id:
                self.run_test(
                    f"Get Product by ID ({product_id[:8]})",
                    "GET",
                    f"products/{product_id}",
                    200
                )
            
            # Test product filters
            self.run_test(
                "Get Products with Island Filter",
                "GET",
                f"products?island_id={first_product.get('island_id', '')}",
                200
            )
            
            self.run_test(
                "Get Products with Mood Filter", 
                "GET",
                f"products?mood={first_product.get('mood', '')}",
                200
            )
            
            return products
        else:
            print("❌ No products found")
            return []

    def test_quiz_endpoints(self):
        """Test quiz endpoints"""
        print("\n" + "="*50)
        print("TESTING QUIZ ENDPOINTS")
        print("="*50)
        
        # Get quiz
        success, quiz = self.run_test(
            "Get Quiz Configuration",
            "GET",
            "quiz",
            200
        )
        
        if success and quiz.get('questions'):
            print(f"✅ Found quiz with {len(quiz['questions'])} questions")
            
            # Test quiz submission
            questions = quiz['questions']
            if questions:
                # Submit quiz with first option of each question
                answers = []
                for question in questions:
                    if question.get('options'):
                        answers.append(question['options'][0]['text'])
                
                if answers:
                    self.run_test(
                        "Submit Quiz",
                        "POST",
                        "quiz/submit",
                        200,
                        data={"answers": answers}
                    )
        
        return quiz

    def test_theme_endpoints(self):
        """Test theme endpoints"""
        print("\n" + "="*50)
        print("TESTING THEME ENDPOINTS")
        print("="*50)
        
        # Get theme
        success, theme = self.run_test(
            "Get Theme Settings",
            "GET",
            "theme",
            200
        )
        
        return theme

    def test_faq_endpoints(self):
        """Test FAQ endpoints"""
        print("\n" + "="*50)
        print("TESTING FAQ ENDPOINTS")
        print("="*50)
        
        # Get FAQs
        success, faqs = self.run_test(
            "Get All FAQs",
            "GET",
            "faq",
            200
        )
        
        if success:
            print(f"✅ Found {len(faqs)} FAQs")
        
        return faqs

    def test_orders_endpoints(self):
        """Test orders endpoints"""
        print("\n" + "="*50)
        print("TESTING ORDERS ENDPOINTS")
        print("="*50)
        
        # Test create order
        test_order = {
            "customer_name": "Test Customer",
            "customer_email": "test@example.com",
            "customer_phone": "+62123456789",
            "customer_address": "Test Address, Jakarta",
            "items": [
                {
                    "product_id": "test-product-id",
                    "product_name": "Test Product",
                    "quantity": 1,
                    "price": 500000
                }
            ],
            "notes": "Test order"
        }
        
        success, order = self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            data=test_order
        )
        
        # Test get orders (admin only)
        if self.token:
            self.run_test(
                "Get All Orders (Admin)",
                "GET",
                "admin/orders",
                200
            )
        
        return order

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Archipelago Scent API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print(f"🕐 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Test authentication first
        auth_success = self.test_auth_flow()
        
        # Test all endpoints
        islands = self.test_islands_endpoints()
        products = self.test_products_endpoints()
        quiz = self.test_quiz_endpoints()
        theme = self.test_theme_endpoints()
        faqs = self.test_faq_endpoints()
        order = self.test_orders_endpoints()
        
        # Print final results
        print("\n" + "="*60)
        print("FINAL TEST RESULTS")
        print("="*60)
        print(f"📊 Tests passed: {self.tests_passed}/{self.tests_run}")
        print(f"✅ Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed tests ({len(self.failed_tests)}):")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"   {i}. {test['name']}")
                if 'error' in test:
                    print(f"      Error: {test['error']}")
                else:
                    print(f"      Expected: {test['expected']}, Got: {test['actual']}")
        
        # Return summary data
        return {
            'total_tests': self.tests_run,
            'passed_tests': self.tests_passed,
            'failed_tests': len(self.failed_tests),
            'success_rate': (self.tests_passed/self.tests_run)*100 if self.tests_run > 0 else 0,
            'auth_success': auth_success,
            'data_found': {
                'islands': len(islands) if islands else 0,
                'products': len(products) if products else 0,
                'quiz_questions': len(quiz.get('questions', [])) if quiz else 0,
                'faqs': len(faqs) if faqs else 0
            },
            'failed_test_details': self.failed_tests
        }

def main():
    tester = ArchipelagoScentAPITester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if results['success_rate'] >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())