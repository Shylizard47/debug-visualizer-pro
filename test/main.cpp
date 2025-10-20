#include <iostream>
#include <vector>
#include <map>

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

int main() {
    std::vector<int> myArray = {10, 20, 30, 40, 50};
    std::map<std::string, int> myHashMap;
    myHashMap["apple"] = 5;
    myHashMap["banana"] = 3;
    
    TreeNode* root = new TreeNode(50);
    root->left = new TreeNode(30);
    root->right = new TreeNode(70);
    
    std::cout << "Debug point!" << std::endl;  // SET BREAKPOINT HERE
    return 0;
}