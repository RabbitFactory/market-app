import { SafeAreaView } from "react-native-safe-area-context";
import sale from "../assets/images/sale.gif";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { formatDistanceToNow } from "date-fns";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ProductsShopAPI, Product } from "../api/data";
import CartButton from "@/components/CartButton";

const api = new ProductsShopAPI();

const Marketplace = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setPage(1); // reset page to 1
      const response = await api.getProducts({ page: 1 });
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    if (loading || page > totalPages) return;

    setLoading(true);
    try {
      const response = await api.getProducts({ page });
      setProducts((prevProducts) => [...prevProducts, ...response.data]);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const renderItem = ({ item }: { item: Product }) => {
    const timeAgo = formatDistanceToNow(new Date(item.postedAt), { addSuffix: true });
    
    return (
      <View style={styles.productCard}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
        ></Image>
        {item.dealType === "SALE" && (
          <Image style={styles.saleStyle} source={sale}></Image>
        )}
        {item.category === "Household" && (
          <View style={styles.categoryStyle}>
            <FontAwesome6 name="house-chimney" size={20} color="white" />
          </View>
        )}
        {item.category === "Clothing" && (
          <View style={styles.categoryStyle}>
            <FontAwesome5 name="tshirt" size={20} color="white" />
          </View>
        )}
        {item.category === "Garden" && (
          <View style={styles.categoryStyle}>
            <MaterialCommunityIcons name="flower" size={24} color="white" />
          </View>
        )}

        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productInfoContainer}>
          <View style={styles.productDetails}>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.productDate}>Posted {timeAgo}</Text>
            <Text style={styles.productDistance}>
              Distance: {item.distanceInKm} km
            </Text>
          </View>
          <CartButton />
        </View>
      </View>
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const filteredProducts = products.filter(
    (item) => selectedFilter === "All" || item.category === selectedFilter
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Market<Text style={{ fontWeight: "bold", color: "#16C47F" }}>place</Text></Text>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {["All", "Household", "Clothing", "Garden"].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilterButton,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.selectedFilterButtonText,
              ]}
            >
              {filter}
            </Text>
            {filter === "Household" && <FontAwesome6 name="house-chimney" size={14} color="black" />}
            {filter === "Clothing" && <FontAwesome5 name="tshirt" size={14} color="black" />}
            {filter === "Garden" && <MaterialCommunityIcons name="flower" size={18} color="black" />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Products */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={renderItem}
        numColumns={1}
        contentContainerStyle={styles.grid}
        onEndReached={() => {
          if (!loading && page < totalPages) {
            setPage((prevPage) => prevPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#007BFF" /> : null
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  categoryStyle: {
    position: "absolute",
    top: 28,
    right: 28,
    backgroundColor: "#16C47F",
    width: 36,
    height: 36,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  header: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: "center",
    textTransform: "uppercase",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedFilterButton: {
    backgroundColor: "#16C47F",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedFilterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  grid: {
    paddingBottom: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  saleStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: 80,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    color: "#16C47F",
    marginBottom: 4,
    fontWeight: "bold",
  },
  productDistance: {
    fontSize: 12,
    color: "gray",
  },
  productInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  productDetails: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
  },
});

export default Marketplace;
