#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

int main() {
    string str;
    cin >> str;

    unordered_map<char, int> freq;

    // Count frequency of each character
    for (char ch : str) {
        freq[ch]++;
    }

    vector<pair<int, char>> result;

    // Find non-repeating characters
    for (int i = 0; i < str.length(); i++) {
        if (freq[str[i]] == 1) {
            result.push_back({i, str[i]});
        }
    }

    // Check if at least two non-repeating characters exist
    if (result.size() < 2) {
        cout << -1;
    } else {
        cout << result[0].first << " - " << result[0].second << endl;
        cout << result[1].first << " - " << result[1].second;
    }

    return 0;
}
