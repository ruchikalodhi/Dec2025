class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        self.balanced = True

        def height(node):
            if not node:
                return 0

            left = height(node.left)
            right = height(node.right)

            if abs(left - right) > 1:
                self.balanced = False

            return 1 + max(left, right)

        height(root)
        return self.balanced
